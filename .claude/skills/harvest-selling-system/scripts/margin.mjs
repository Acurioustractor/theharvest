#!/usr/bin/env node
// The Harvest — margin & pricing calculator
// No dependencies. Run with: node margin.mjs <command> ...
//
// Cost is ALWAYS entered ex-GST (what you actually pay net of GST credits —
// the "Price" column on a Bidfood invoice, not "Total").
// Sales of prepared/hot food and most cafe drinks are TAXABLE in Australia,
// so by default a shelf price includes 10% GST that is NOT yours to keep:
//   net revenue = price / 1.1
// Use --gst-free for the rare item whose SALE carries no GST (some packaged
// shop goods, plain unprepared food). It does not change the cost side.
//
// Commands:
//   price  <cost> <targetCostPct> [--gst-free] [--round N]
//       What to charge to hit a target food/drink cost %.
//       targetCostPct is cost as a % of NET (ex-GST) revenue.
//       e.g.  node margin.mjs price 6.10 33        -> price a pepperoni pizza at 33% cost
//             node margin.mjs price 2.54 50 --gst-free   -> coconut water (GST-free)
//
//   check  <cost> <price> [--gst-free]
//       Given a cost and a shelf price, show margin $, margin %, cost %.
//       e.g.  node margin.mjs check 6.10 17        -> is $17 a good pepperoni price?
//
//   unit   <packPrice> <unitsPerPack>
//       True cost per sellable unit from a carton/pack price.
//       e.g.  node margin.mjs unit 64.22 24        -> cost per can of Jarritos
//
//   help

const GST = 0.10;

function fmt(n) { return '$' + n.toFixed(2); }
function pct(n) { return (n * 100).toFixed(1) + '%'; }

function parseFlags(args) {
  const flags = { gstFree: false, round: 0.5 };
  const rest = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--gst-free') flags.gstFree = true;
    else if (args[i] === '--round') flags.round = parseFloat(args[++i]);
    else rest.push(args[i]);
  }
  return { flags, rest };
}

function netFrom(price, gstFree) { return gstFree ? price : price / (1 + GST); }
function grossFrom(net, gstFree) { return gstFree ? net : net * (1 + GST); }
function roundTo(value, step) { return step > 0 ? Math.round(value / step) * step : value; }

function cmdPrice(args) {
  const { flags, rest } = parseFlags(args);
  const cost = parseFloat(rest[0]);
  const targetCostPct = parseFloat(rest[1]);
  if (!isFinite(cost) || !isFinite(targetCostPct)) return usage();
  const net = cost / (targetCostPct / 100);
  const grossRaw = grossFrom(net, flags.gstFree);
  const gross = roundTo(grossRaw, flags.round);
  const netActual = netFrom(gross, flags.gstFree);
  const margin = netActual - cost;
  console.log(`\n  Cost (ex-GST):        ${fmt(cost)}`);
  console.log(`  Target cost %:        ${targetCostPct}% of net`);
  console.log(`  Sale GST:             ${flags.gstFree ? 'GST-free' : 'taxable (10%)'}`);
  console.log(`  ----`);
  console.log(`  SHELF PRICE:          ${fmt(gross)}   (rounded from ${fmt(grossRaw)})`);
  console.log(`  Net revenue (ex-GST): ${fmt(netActual)}`);
  console.log(`  Gross margin:         ${fmt(margin)}  (${pct(margin / netActual)})`);
  console.log(`  Actual cost %:        ${pct(cost / netActual)}\n`);
}

function cmdCheck(args) {
  const { flags, rest } = parseFlags(args);
  const cost = parseFloat(rest[0]);
  const price = parseFloat(rest[1]);
  if (!isFinite(cost) || !isFinite(price)) return usage();
  const net = netFrom(price, flags.gstFree);
  const margin = net - cost;
  console.log(`\n  Cost (ex-GST):        ${fmt(cost)}`);
  console.log(`  Shelf price:          ${fmt(price)}  (${flags.gstFree ? 'GST-free' : 'incl 10% GST'})`);
  console.log(`  Net revenue (ex-GST): ${fmt(net)}`);
  console.log(`  ----`);
  console.log(`  Gross margin:         ${fmt(margin)}`);
  console.log(`  Margin %:             ${pct(margin / net)}`);
  console.log(`  Cost %:               ${pct(cost / net)}`);
  const verdict = cost / net <= 0.30 ? 'strong' : cost / net <= 0.40 ? 'healthy' : cost / net <= 0.55 ? 'thin (service item)' : 'loss-leader / check it';
  console.log(`  Read:                 ${verdict}\n`);
}

function cmdUnit(args) {
  const packPrice = parseFloat(args[0]);
  const units = parseFloat(args[1]);
  if (!isFinite(packPrice) || !isFinite(units)) return usage();
  console.log(`\n  Pack price (ex-GST):  ${fmt(packPrice)}`);
  console.log(`  Units per pack:       ${units}`);
  console.log(`  COST PER UNIT:        ${fmt(packPrice / units)}\n`);
}

function usage() {
  console.log(`
The Harvest — margin & pricing calculator

  node margin.mjs price <cost> <targetCostPct> [--gst-free] [--round N]
  node margin.mjs check <cost> <price> [--gst-free]
  node margin.mjs unit  <packPrice> <unitsPerPack>

Cost is ALWAYS ex-GST (Bidfood "Price" column). Sales default to taxable (incl 10% GST);
add --gst-free for items whose sale carries no GST. --round defaults to 0.50.

Examples:
  node margin.mjs unit 64.22 24            # cost per can of Jarritos
  node margin.mjs price 6.10 33            # price a pepperoni pizza at 33% cost
  node margin.mjs check 6.10 17            # is $17 a good pepperoni price?
  node margin.mjs price 2.54 50 --gst-free # coconut water (GST-free sale)
`);
}

const [cmd, ...args] = process.argv.slice(2);
switch (cmd) {
  case 'price': cmdPrice(args); break;
  case 'check': cmdCheck(args); break;
  case 'unit': cmdUnit(args); break;
  default: usage();
}
