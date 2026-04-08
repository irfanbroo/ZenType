// Mirrors the client-side wordPools[0] from src/data/wordPools.js exactly
const WORD_POOL = "the be of and a to in he have it that for they I with as not on she at by this we you do but from or which one would all will there say who make when can more if no man out other so what time up go about than into could state only new year some take come these know see use get like then first any work now may such give over think most even find day also after way many must look before great back through long where much should well people down own just because good each those feel seem how high too place little world very still nation hand old life tell write become here show house both between need mean call develop under last right move thing general school never same another begin while number part turn real leave might want point form off child few small since against ask late home interest large person end open public follow during present without again hold govern around possible head consider word program problem however lead system set order eye plan run keep face fact group play stand increase early course change help line".split(" ");

function generateWordList(count = 120) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)].toLowerCase());
  }
  return list;
}

// Hagakure word pool — samurai-themed
const HAGAKURE_POOL = "blade honor death glory steel blood spirit warrior silence strike swift kill void ghost shadow ronin samurai katana feudal bushido focus breath cherry blossom peace war enemy defeat victory master legend myth soul mind eternal night darkness light flash thunder storm calm stillness meditate discipline respect loyalty sacrifice bravery courage fear pain endure survive conquer rule shogun emperor kingdom dynasty legacy destiny fate karma life rebirth cycle nature mountain river ocean sky moon star sun fire water earth wind metal wood dragon phoenix tiger wolf hawk eagle snake viper cobra venom poison cure heal wound scar battle fight combat duel clash cut slash pierce stab thrust parry block dodge evade counter attack defend guard stance move step walk run sprint jump leap fly soar dive fall rise stand sit kneel bow pray chant sing shout scream whisper talk speak listen hear see watch look observe perceive understand knowing wise fool strong weak fast slow heavy hard soft sharp dull cold hot wet dry clean dirty pure evil good right wrong true false real fake lie truth".split(" ");

function generateHagakureWordList(count = 60) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push(HAGAKURE_POOL[Math.floor(Math.random() * HAGAKURE_POOL.length)]);
  }
  return list;
}

module.exports = { generateWordList, generateHagakureWordList, WORD_POOL, HAGAKURE_POOL };
