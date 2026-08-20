<?php

declare(strict_types=1);

final class MSA_Pricing
{
    public const CHECKED_AT = '2026-08-20';
    public const SOURCE = 'https://www.weglot.com/pricing';

    private const PLANS = [
        ['name' => 'Free', 'translated_words' => 2000, 'languages' => 1, 'monthly' => 0, 'annual' => 0],
        ['name' => 'Starter', 'translated_words' => 10000, 'languages' => 1, 'monthly' => 15, 'annual' => 150],
        ['name' => 'Business', 'translated_words' => 50000, 'languages' => 3, 'monthly' => 29, 'annual' => 290],
        ['name' => 'Pro', 'translated_words' => 200000, 'languages' => 5, 'monthly' => 79, 'annual' => 790],
        ['name' => 'Advanced', 'translated_words' => 1000000, 'languages' => 10, 'monthly' => 299, 'annual' => 2990],
        ['name' => 'Extended', 'translated_words' => 5000000, 'languages' => 20, 'monthly' => 699, 'annual' => 6990],
    ];

    public function calculate(int $source_words, int $destination_languages, string $billing): array
    {
        if ($source_words < 0) {
            throw new InvalidArgumentException('Word count must be zero or greater.');
        }
        if ($destination_languages < 1 || $destination_languages > 20) {
            throw new InvalidArgumentException('Destination languages must be between 1 and 20.');
        }
        if (!in_array($billing, ['monthly', 'annual'], true)) {
            throw new InvalidArgumentException('Billing must be monthly or annual.');
        }

        $translated_words = $source_words * $destination_languages;
        $selected = null;
        foreach (self::PLANS as $plan) {
            if ($plan['translated_words'] >= $translated_words && $plan['languages'] >= $destination_languages) {
                $selected = $plan;
                $selected['price'] = $plan[$billing];
                $selected['period'] = $billing === 'annual' ? 'year' : 'month';
                break;
            }
        }

        return [
            'source_words' => $source_words,
            'destination_languages' => $destination_languages,
            'translated_words' => $translated_words,
            'billing' => $billing,
            'currency' => 'EUR',
            'checked_at' => self::CHECKED_AT,
            'source' => self::SOURCE,
            'plan' => $selected,
        ];
    }

    public static function count_words(string $text): int
    {
        $text = trim((string) preg_replace('/\s+/u', ' ', wp_strip_all_tags($text)));
        if ($text === '') {
            return 0;
        }
        preg_match_all('/[\p{L}\p{N}]+(?:[\x{2019}\'\.-][\p{L}\p{N}]+)*/u', $text, $matches);
        return count($matches[0]);
    }
}
