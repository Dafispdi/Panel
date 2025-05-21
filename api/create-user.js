export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, username, first_name, last_name, language, password } = req.body;

  if (!email || !username || !first_name || !last_name || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await fetch("https://kyxzanler.cjdw.tech/api/application/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ptla_co0AqzMKBwGdqLCQpmGKRlXt6zMoGzuebsB6h20HBV9"
      },
      body: JSON.stringify({
        email,
        username,
        first_name,
        last_name,
        language: language || "en",
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.errors || data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", detail: err.message });
  }
}
