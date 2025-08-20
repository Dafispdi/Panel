async function handleBugSend(chatId, selectedBug) {
  const res = await fetch(`https://kyxzan-ganzz.404-eror.systems/kyxsan?chatId=${encodeURIComponent(chatId)}&type=${selectedBug}`);
  if (!res.ok) throw new Error("Gagal menghubungi server");
  return await res.json();
}
