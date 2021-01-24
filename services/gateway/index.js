const { findAndParseConfig } = require("@graphql-mesh/config");
const { getMesh } = require("@graphql-mesh/runtime");

async function test() {
  // This will load the config file from the default location (process.cwd)
  const meshConfig = await findAndParseConfig();
  const { execute } = await getMesh(meshConfig);

  const { data, errors } = await execute(/* GraphQL */ `
    query {
        getPerson(email: "roie.cohen@gmail.com") {
            name
            twitterHandle
            instagramHandle
        }
    }
  `);
}

test()