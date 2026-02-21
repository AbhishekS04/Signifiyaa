export async function getOfferConfig() {
  try {
    const res = await fetch(
      "https://github.com/Tusharxhub/Signifiya/blob/main/config.json"
    );

    const data = await res.json();

    const today = new Date();
    const expiry = new Date(data.offer.expiry);

    if (data.offer.show && today <= expiry) {
      return data.offer;
    }

    return null;
  } catch (e) {
    return null;
  }
}