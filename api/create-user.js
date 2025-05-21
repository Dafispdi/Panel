export default async function handler(req, res) {
  const response = await fetch("https://kyxzanler.cjdw.tech/api/application/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer ptla_co0AqzMKBwGdqLCQpmGKRlXt6zMoGzuebsB6h20HBV9"
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
