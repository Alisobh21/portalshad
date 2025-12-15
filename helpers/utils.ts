export type WithKeyLabel<T> = T & { key: unknown; label: unknown };

export function attachKeyLabel<T extends Record<string, unknown>>(
  arr: T[] | null | undefined,
  key: keyof T,
  label: keyof T
): Array<WithKeyLabel<T>> | null | undefined {
  if (!arr || !Array.isArray(arr)) {
    return arr as Array<WithKeyLabel<T>> | null | undefined;
  }

  return arr.map((item) => ({
    ...item,
    key: item[key],
    label: item[label],
  }));
}

export function downloadBlob(
  data: BlobPart | BlobPart[],
  filename = "downloaded-file",
  mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
): void {
  const blobParts = Array.isArray(data) ? data : [data];
  const blob = new Blob(blobParts, { type: mimeType });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function truncateFromStart(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(text.length - maxLength)}…`;
}

export const scrollUpOnePixel = (): void => {
  if (typeof window !== "undefined") {
    window.scrollBy(0, -1);
  }
};

export function formatDashedName(str?: string | null): string {
  return (
    str
      ?.trim()
      ?.replace(/_/g, " ")
      ?.split(" ")
      ?.filter(Boolean)
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      ?.join(" ") || ""
  );
}

export function formatDateNoTime(
  timestamp: string | number | Date,
  withDash?: boolean
): string {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return withDash ? `${year}-${month}-${day}` : `${day}/${month}/${year}`;
}

export function flatKMNumbers(value: number | string): number {
  if (typeof value === "string") {
    if (value.includes("K")) {
      const num = parseFloat(value.replace("K", ""));
      return num * 1000;
    }
    if (value.includes("M")) {
      const num = parseFloat(value.replace("M", ""));
      return num * 1_000_000;
    }
    return Number(value) || 0;
  }

  return value;
}

type ItemWithId = { id: string | number };

export function removeDuplicatesById<T extends ItemWithId>(array: T[]): T[] {
  const seen = new Set<ItemWithId["id"]>();
  const duplicates = new Set<ItemWithId["id"]>();
  const result: T[] = [];

  for (const item of array) {
    if (seen.has(item.id)) {
      if (!duplicates.has(item.id)) {
        result.push(item);
        duplicates.add(item.id);
      }
    } else {
      seen.add(item.id);
    }
  }

  return result;
}

type PhoneRule = { pattern: RegExp; length: number; errorKey: string };
type Translator = (key: string) => string;

const phoneRules: Record<string, PhoneRule> = {
  "المملكة العربية السعودية": {
    pattern: /^5\d{8}$/,
    length: 9,
    errorKey: "phoneSaudiInvalid",
  },
  "الإمارات العربية المتحدة": {
    pattern: /^5\d{8}$/,
    length: 9,
    errorKey: "phoneUAEInvalid",
  },
  البحرين: { pattern: /^3\d{7}$/, length: 8, errorKey: "phoneBahrainInvalid" },
  قطر: { pattern: /^3\d{7}$/, length: 8, errorKey: "phoneQatarInvalid" },
  الكويت: {
    pattern: /^[569]\d{7}$/,
    length: 8,
    errorKey: "phoneKuwaitInvalid",
  },
  عمان: { pattern: /^9\d{7}$/, length: 8, errorKey: "phoneOmanInvalid" },
  مصر: {
    pattern: /^(010|011|012|015)\d{8}$/,
    length: 11,
    errorKey: "phoneEgyptInvalid",
  },
  الأردن: { pattern: /^7\d{8}$/, length: 9, errorKey: "phoneJordanInvalid" },
};

type ValidFirstDigits = string | string[];

const validFirstDigits: Record<string, ValidFirstDigits> = {
  "المملكة العربية السعودية": "5",
  "الإمارات العربية المتحدة": "5",
  البحرين: "3",
  قطر: "3",
  الكويت: ["5", "6", "9"],
  عمان: "9",
  مصر: "0",
  الأردن: "7",
};

export function validatePhoneByCountry(
  country: string,
  phone: string,
  t: Translator
): true | string {
  const rule = phoneRules[country];
  if (!rule) return t("phonePatternInvalid");

  if (!phone) return t("phoneRequired");

  const expectedStart = validFirstDigits[country];
  if (expectedStart) {
    const startsCorrectly = (
      Array.isArray(expectedStart) ? expectedStart : [expectedStart]
    ).some((digit) => phone.startsWith(digit));

    if (!startsCorrectly) return t(rule.errorKey);
  }

  if (phone.length < rule.length && phone.length < 4) return true;

  if (!rule.pattern.test(phone)) return t(rule.errorKey);

  return true;
}

export type CountryData = {
  code: string;
  flag: string;
};

export const countryData: Record<string, CountryData> = {
  "المملكة العربية السعودية": {
    code: "+966",
    flag: "https://flagcdn.com/w20/sa.png",
  },
  "الإمارات العربية المتحدة": {
    code: "+971",
    flag: "https://flagcdn.com/w20/ae.png",
  },
  البحرين: { code: "+973", flag: "https://flagcdn.com/w20/bh.png" },
  قطر: { code: "+974", flag: "https://flagcdn.com/w20/qa.png" },
  الكويت: { code: "+965", flag: "https://flagcdn.com/w20/kw.png" },
  عمان: { code: "+968", flag: "https://flagcdn.com/w20/om.png" },
  مصر: { code: "+20", flag: "https://flagcdn.com/w20/eg.png" },
  الأردن: { code: "+962", flag: "https://flagcdn.com/w20/jo.png" },
};
