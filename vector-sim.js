const EMBEDDING_MODEL = "Xenova/paraphrase-MiniLM-L3-v2";

(async function (){
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("Usage: vector-sim 'Something' 'Some other thing'");
    process.exit(-1);
  }

  const transformers = await import("@xenova/transformers");
  const { pipeline, cos_sim } = transformers;
  const extractor = await pipeline('feature-extraction', EMBEDDING_MODEL, { quantize: true });

  const db = {};

  for (const text of args) {
    const output = await extractor([text], { polling: 'mean', normalize: true});
    const embedding = output[0].data;
    db[text] = embedding;
  }

  if (args.length != 2) {
    console.log(db);
    process.exit(0);
  }

  console.log(`Comparing...\n\t${args[0]}\n\t${args[1]}\n`);
  console.log(Math.abs(cos_sim(db[args[0]], db[args[1]])));
})();