import SecureLS from "secure-ls";

let lsSecure: SecureLS | null = null;

if (typeof window !== "undefined") {
  lsSecure = new SecureLS({
    encodingType: "aes",
    encryptionSecret: process.env.NEXT_PUBLIC_ENCRPTION_SECRET || "",
  });
}

export default lsSecure;
