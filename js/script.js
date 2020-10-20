"use strict";
function vaQuery(input) {
  // Here we define our query as a multi-line string
  // Storing it in a separate .graphql/.gql file is also possible
  var query = `
    query ($name: String) { # Define which variables will be used in the query (id)
        Staff (search: $name) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
          id
          name {
            full
            native
          }
          image {
            large
          }
          siteUrl
          characters {
            edges {
              id
              node {
                name{
                  full
                }
                image {
                  large
                }
                siteUrl
              }
              media {
                title {
                  romaji
                  english
                }
                id
                coverImage {
                  extraLarge
                  large
                  medium
                  color
                }
              }
            }
          }
        }
      }
  `;

  // Define our query variables and values that will be used in the query request
  var variables = {
    name: input,
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
    console.log(data.data.Staff);
    document.querySelector(`#top`).appendChild(createVACard(data.data.Staff));
  }

  function handleError(error) {
    alert("Search failed");
    console.error(error);
  }

  function createVACard(staff) {
      let card = document.createElement("div");
      card.classList.add("card", "mr-5", "ml-5");

      let vaImageAnchor = document.createElement("a");
      vaImageAnchor.href = staff.siteUrl;
      vaImageAnchor.target = "_blank";

      let vaImage = document.createElement("img");
      vaImage.classList.add("card-img");
      vaImage.id = staff.name.full.replace(/\s+/g, '');
      vaImage.src = staff.image.large;

      vaImageAnchor.appendChild(vaImage);

      let cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      let vaNameAnchor = document.createElement("a");
      vaNameAnchor.href = staff.siteUrl;

      let vaNameText = document.createElement("h5");
      vaNameText.classList.add("card-title");
      vaNameText.textContent = staff.name.full;

      let vaNameNativeAnchor = document.createElement("a");
      vaNameNativeAnchor.href = staff.siteUrl;

      let vaNameNativeText = document.createElement("small");
      vaNameNativeText.classList.add("text-muted");
      vaNameNativeText.textContent = staff.name.native;
      console.log(staff.name.native);

      vaNameAnchor.appendChild(vaNameText);
      vaNameAnchor.target = "_blank";

      vaNameNativeAnchor.appendChild(vaNameNativeText);
      vaNameNativeAnchor.target = "_blank";

      cardBody.appendChild(vaNameAnchor);
      cardBody.appendChild(vaNameNativeAnchor);
      
      card.appendChild(vaImageAnchor);
      card.appendChild(cardBody);

      return card;
  }

  (function() {
  })();

}

function userQuery(input) {
    var query = `
    query ($name: String) { # Define which variables will be used in the query (id)
        User(name: $name) {
          id
          name
          avatar {
            large
            medium
          }
        }
      }
  `;

  // Define our query variables and values that will be used in the query request
  var variables = {
    name: input,
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
    console.log(data.data.User);
    document.querySelector(`#profile-picture`).src = data.data.User.avatar.large;
    document.querySelector(`#profile-name`).textContent = data.data.User.name;
  }

  function handleError(error) {
    alert("Search failed");
    console.error(error);
  }
  
}

/*

Example of VA Card (goes in #top):

<div class="card">
    <a href="https://anilist.co/staff/95185/Kana-Hanazawa"><img class="card-img" id="KanaHanazawa" src="resources/kana.jpg"></a>
    <div class="card-body">
    <a href="https://anilist.co/staff/95185/Kana-Hanazawa"><h5 class="card-title">Kana Hanazawa</h5></a>
    <small class="text-muted">花澤香菜</small>
    </div>
</div>

*/
