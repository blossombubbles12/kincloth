module.exports = async ({ container }) => {
  const query = container.resolve("query");
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id", "token"],
    filters: {
      type: "publishable",
    },
  });
  console.log("--------------------");
  console.log("PUBLISHABLE_TOKEN:" + data[0].token);
  console.log("--------------------");
};
