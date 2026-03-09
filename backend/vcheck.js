require("dotenv").config();
const jwt = require("jsonwebtoken");
const http = require("http");

const t = jwt.sign({ id: "a", role: "kitchen_staff", name: "C" }, "nutrisync_jwt_secret_change_in_production", { expiresIn: "1h" });

function fetchOrders(mealType) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000/api/kitchen/orders?mealType=${mealType}`, { headers: { Authorization: "Bearer " + t } }, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => resolve(JSON.parse(d)));
      res.on("error", reject);
    });
  });
}

async function main() {
  const dairyFoods = ["milk", "cheese", "butter", "yogurt", "curd", "paneer", "ghee", "cream", "buttermilk"];
  let violations = 0;
  let safe = 0;
  
  for (const mealType of ["breakfast", "lunch", "dinner", "snack"]) {
    const orders = await fetchOrders(mealType);
    const dairyGroups = orders.filter(o => o.groupName && o.groupName.toLowerCase().includes("dairy"));
    
    for (const o of dairyGroups) {
      const ingNames = o.meal.ingredients.map(i => i.name.toLowerCase());
      const badOnes = ingNames.filter(n => dairyFoods.some(f => n.includes(f)));
      
      if (badOnes.length > 0) {
        violations++;
        console.log(`VIOLATION: ${mealType} | ${o.groupCode} ${o.groupName} | ${o.meal.name} | bad: ${badOnes.join(", ")}`);
      } else {
        safe++;
        console.log(`SAFE: ${mealType} | ${o.groupCode} | ${o.meal.name} | ingr: ${ingNames.join(", ")}`);
      }
    }
  }
  
  console.log(`\nTotal: ${safe} safe, ${violations} violations`);
  if (violations === 0) console.log("ALL DAIRY-ALLERGY GROUPS SERVED SAFE MEALS");
  else console.log("SOME VIOLATIONS FOUND - FILTERING NEEDS FIX");
}

main().catch(console.error);
