function vaQuery() {
  // Here we define our query as a multi-line string
  // Storing it in a separate .graphql/.gql file is also possible
  var query = `
query ($name: String) { # Define which variables will be used in the query (id)
    Staff (search: $name) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
      id
      name {
        full
      }
    }
  }
`;

  // Define our query variables and values that will be used in the query request
  var variables = {
    name: "Kana Hanazawa",
  };

  // Define the config we'll need for our Api request
  var url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

  // Make the HTTP Api request
  fetch(url, options).then(handleResponse).then(handleData).catch(handleError);

  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }

  function handleData(data) {
    console.log(data);
  }

  function handleError(error) {
    alert("Error, check console");
    console.error(error);
  }
}
