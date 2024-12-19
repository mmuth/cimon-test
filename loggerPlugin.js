module.exports = {
  requestDidStart(requestContext) {
    console.log(
      "=====  Request at " + new Date().toLocaleTimeString() + " ====="
    );
    console.log("Request at " + new Date());
    console.log(
      "Query:\n" +
        JSON.stringify(requestContext.request.query, null, 2) +
        "\n\n"
    );
    console.log(
      "Variables:\n" +
        JSON.stringify(requestContext.request.variables, null, 2) +
        "\n"
    );

    return {
      willSendResponse(requestContext) {
        console.log(
          "=== Sending Response ===\n" +
            JSON.stringify(requestContext.response, null, 2) +
            "\n"
        );
      },
    };
  },
};
