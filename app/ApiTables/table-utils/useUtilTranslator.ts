"use client";

import { useTranslations } from "next-intl";

/**
 * A custom hook that provides translation utilities for table operators
 *
 * This hook uses next-intl for internationalization and provides a function
 * to translate common comparison operators into human-readable labels.
 *
 * @returns {Object} An object containing utility functions
 * @returns {Function} getOperatorLabel - Translates operator symbols to readable labels
 *
 * Features:
 * - Translates common comparison operators (=, like, >=, <=)
 * - Uses internationalization through next-intl
 * - Returns human-readable labels from translation keys
 *
 * @example
 * ```tsx
 * const { getOperatorLabel } = useUtilTranslator();
 * const label = getOperatorLabel("="); // Returns translated "Exact Match"
 * ```
 */
export default function useUtilTranslator() {
    const t = useTranslations("General");

    /**
     * Converts operator symbols to their corresponding translated labels
     *
     * @param {string} operator - The operator symbol to translate
     * @returns {string} The translated label for the operator
     */
    function getOperatorLabel(operator: string) {
        if (operator === "=") {
            return t("exact");
            // return 'Exact Match';
        }
        if (operator === "like") {
            return t("like");
            // return 'Like';
        }
        if (operator === ">=") {
            return t("greaterOrEqual");
            // return 'Equal Or Greater';
        }
        if (operator === "<=") {
            return t("lessOrEqual");
            // return 'Less Or EQual';
        }
    }

    return { getOperatorLabel };
}
