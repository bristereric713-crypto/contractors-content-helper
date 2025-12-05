console.log("Contractor’s Content Helper • GPT-4o Active");

const outputBox = document.getElementById("output");
const cards = document.querySelectorAll(".tool-card");

// DEFAULT CARD ORDER
let stackOrder = ["titles", "clusters", "blog"];

function updateCards() {
  stackOrder.forEach((tool, i) => {
    const card = document.querySelector(`.tool-card[data-tool="${tool}"]`);
    card.classList.remove("card-active", "card-left", "card-right");

    if (i === 0) card.classList.add("card-active");
    if (i === 1) card.classList.add("card-left");
    if (i === 2) card.classList.add("card-right");
  });
}
updateCards();

cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("generate-btn")) return;

    const tool = card.dataset.tool;
    while (stackOrder[0] !== tool) {
      stackOrder.push(stackOrder.shift());
    }
    updateCards();
  });
});

// 🔥 REAL GPT-4o CALL (Through Your Replit Backend)
async function callGPT(prompt) {
  const res = await fetch("/gpt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  return data.reply;
}

document.querySelectorAll(".generate-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const tool = btn.dataset.tool;
    let input = "";

    if (tool === "titles") input = document.getElementById("input-titles").value;
    if (tool === "clusters") input = document.getElementById("input-clusters").value;
    if (tool === "blog") input = document.getElementById("input-blog").value;

    const prompt = `
    You are a contractor SEO and content expert.

    IMPORTANT:
    Return ONLY valid HTML. Do NOT include backticks. Do NOT explain anything.

    FORMAT RULES:
    - Use <h2> for the main heading
    - Use <h3> for subheadings
    - Use <ul><li> for lists
    - Use <p> for paragraphs
    - Do NOT include numbering like "1." inside paragraphs — use <li> instead
    - Make the result clean and highly readable

    NOW GENERATE:
    ${
      tool === "titles"
        ? `A list of 5 authoritative, SEO-optimized page titles for: "${input}". 
           Format as: 
           <h2>Authority Titles</h2>
           <ul><li>Title</li></ul>`
        : tool === "clusters"
        ? `Full Koray-style topic clusters for: "${input}". 
           Use:
           <h2>TOFU</h2>
           <ul><li>topics</li></ul>
           <h2>MOFU</h2>
           <ul><li>topics</li></ul>
           <h2>BOFU</h2>
           <ul><li>topics</li></ul>`
        : `A high-converting SEO blog outline for: "${input}". 
           Use headings, subheadings, bullet lists, and paragraphs.`
    }
    `;

    outputBox.innerHTML = "<p>⏳ Generating...</p>";

    const reply = await callGPT(prompt);
    outputBox.innerHTML = reply;
  });
});

// Prevent CTA reload
document.querySelector(".cta-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Your SEO roadmap request has been submitted!");
});
