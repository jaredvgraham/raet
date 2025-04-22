export async function verifyAppleReceipt(receipt: string) {
  const url = "https://buy.itunes.apple.com/verifyReceipt";
  const sharedSecret = process.env.APP_SHARED_SECRET;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      receipt_data: receipt,
      password: sharedSecret,
      exclude_old_transactions: true,
    }),
  });

  const data = await response.json();
  return data;
}
