document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resetButton = document.getElementById("resetButton");
  const recommendationsDiv = document.getElementById("recommendations");
  const bookNowButton = document.querySelector(".book-now");

  // Variable to store the fetched data
  let travelData = [];

  const categories = {
    beach: {
      title: "Beach Destinations",
      description:
        "Relax and unwind at these beautiful coastal destinations with crystal clear waters and sandy shores.",
    },
    temple: {
      title: "Temple Destinations",
      description:
        "Explore these historic and sacred sites that showcase remarkable architecture and cultural significance.",
    },
    country: {
      title: "Popular Countries",
      description:
        "Discover these amazing countries with their unique cultures, landscapes, and attractions.",
    },
  };

  fetchTravelData();

  function fetchTravelData() {
    // Show loading state
    recommendationsDiv.className = "loading";

    fetch("travel_recommendation_api.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // Log the fetched data to check if it's working

        // Process the data to create a flat array of destinations
        processData(data);

        // Remove loading state
        recommendationsDiv.classList.remove("loading");

        displayRecommendations(travelData);
      })
      .catch((error) => {
        console.error("Error fetching travel data:", error);
        recommendationsDiv.classList.remove("loading");
        recommendationsDiv.innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error loading recommendations. Please try again later.</p>
            <p class="error-details">${error.message}</p>
          </div>
        `;
      });
  }

  // Process the JSON data to create a flat array of all destinations
  function processData(data) {
    // Process countries and cities
    if (data.countries) {
      data.countries.forEach((country) => {
        travelData.push({
          name: country.name,
          description: `Explore the diverse attractions and culture of ${country.name}.`,
          imageUrl:
            country.cities && country.cities.length > 0
              ? country.cities[0].imageUrl
              : "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&h=500&fit=crop&q=80",
          type: "Country",
          keywords: ["country", "countries", country.name.toLowerCase()],
        });

        if (country.cities) {
          country.cities.forEach((city) => {
            travelData.push({
              name: city.name,
              description: city.description,
              imageUrl: city.imageUrl,
              type: "City",
              country: country.name,
              keywords: ["city", "cities", country.name.toLowerCase()],
            });
          });
        }
      });
    }

    if (data.temples) {
      data.temples.forEach((temple) => {
        travelData.push({
          name: temple.name,
          description: temple.description,
          imageUrl: temple.imageUrl,
          type: "Temple",
          keywords: [
            "temple",
            "temples",
            "religious",
            "historic",
            "monument",
            "shrine",
            "sacred",
          ],
        });
      });
    }

    if (data.beaches) {
      data.beaches.forEach((beach) => {
        travelData.push({
          name: beach.name,
          description: beach.description,
          imageUrl: beach.imageUrl,
          type: "Beach",
          keywords: [
            "beach",
            "beaches",
            "coast",
            "coastal",
            "ocean",
            "sea",
            "sand",
            "shores",
            "seaside",
          ],
        });
      });
    }

    // Add additional keywords based on destination names and descriptions
    travelData.forEach((item) => {
      // Extract location name
      const parts = item.name.split(",");
      if (parts.length > 1) {
        const location = parts[1].trim().toLowerCase();
        if (!item.keywords.includes(location)) {
          item.keywords.push(location);
        }
      }

      // Add the first part of the name as a keyword
      const firstPart = parts[0].trim().toLowerCase();
      if (!item.keywords.includes(firstPart)) {
        item.keywords.push(firstPart);
      }

      // Extract key words from description
      const descWords = item.description
        .toLowerCase()
        .replace(/[.,]/g, "")
        .split(" ")
        .filter((word) => word.length > 4);

      // Add unique words from description to keywords
      descWords.forEach((word) => {
        if (!item.keywords.includes(word)) {
          item.keywords.push(word);
        }
      });
    });

    // console.log("Processed travel data:", travelData);
  }

  function displayRecommendations(recommendations, searchTerm = null) {
    recommendationsDiv.innerHTML = "";

    if (recommendations.length === 0) {
      recommendationsDiv.innerHTML =
        "<p class='no-results'>No destinations found matching your search.</p>";
      return;
    }

    if (searchTerm) {
      const searchHeader = document.createElement("div");
      searchHeader.className = "search-results-header";
      searchHeader.innerHTML = `
        <h2>Search Results</h2>
        <p>Showing results for <span class="search-term">${searchTerm}</span></p>
      `;
      recommendationsDiv.appendChild(searchHeader);
    }

    // Group recommendations by type for better organization
    const groupedRecommendations = groupRecommendationsByType(recommendations);

    // Display each category
    for (const [type, items] of Object.entries(groupedRecommendations)) {
      if (items.length > 0) {
        const categorySection = createCategorySection(type, items);
        recommendationsDiv.appendChild(categorySection);
      }
    }
  }

  // Function to group recommendations by type
  function groupRecommendationsByType(recommendations) {
    const grouped = {
      beach: recommendations.filter((item) => item.type === "Beach"),
      temple: recommendations.filter((item) => item.type === "Temple"),
      country: recommendations.filter((item) => item.type === "Country"),
      city: recommendations.filter((item) => item.type === "City"),
    };

    return grouped;
  }

  // Function to create a category section
  function createCategorySection(type, items) {
    const section = document.createElement("div");
    section.className = "recommendation-category";

    // Get category title and description
    let title = `${type} Destinations`;
    let description = `Explore these amazing ${type.toLowerCase()} destinations.`;

    if (categories[type.toLowerCase()]) {
      title = categories[type.toLowerCase()].title;
      description = categories[type.toLowerCase()].description;
    }

    // Create category header
    section.innerHTML = `
      <h2>${title}</h2>
      <p>${description}</p>
    `;

    // Create grid for this category
    const grid = document.createElement("div");
    grid.className = "recommendations-grid";

    // Add items to grid
    items.forEach((item) => {
      const card = createDestinationCard(item);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
  }

  // Function to create a destination card
  function createDestinationCard(item) {
    const card = document.createElement("div");
    card.className = "recommendation-card";

    // Create image element with fallback
    const imageContainer = document.createElement("div");
    imageContainer.className = "card-image";

    const image = document.createElement("img");
    const imagePath = getImagePath(item.imageUrl);
    image.src = imagePath;
    image.alt = item.name;

    // Add error handler for images
    image.onerror = function () {
      this.src =
        "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&h=500&fit=crop&q=80"; // Fallback travel image
      console.log(
        `Failed to load image for ${item.name}, using fallback travel image`
      );
    };

    imageContainer.appendChild(image);

    // Create card content
    const content = document.createElement("div");
    content.className = "card-content";

    // Create card header
    const header = document.createElement("div");
    header.className = "card-header";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const type = document.createElement("span");
    type.className = "destination-type";
    type.textContent = item.type;

    header.appendChild(title);
    header.appendChild(type);

    const desc = document.createElement("p");
    desc.textContent = item.description;

    // Create card actions
    const actions = document.createElement("div");
    actions.className = "card-actions";

    const detailsButton = document.createElement("button");
    detailsButton.className = "view-details-btn";
    detailsButton.textContent = "View Details";
    detailsButton.addEventListener("click", () => {
      alert(`You selected ${item.name}. More details coming soon!`);
    });

    const visitButton = document.createElement("button");
    visitButton.className = "view-details-btn visit-btn";
    visitButton.textContent = "Visit";
    visitButton.addEventListener("click", () => {
      alert(`Planning your trip to ${item.name}. Booking system coming soon!`);
    });

    actions.appendChild(detailsButton);
    actions.appendChild(visitButton);

    // Append elements to card
    content.appendChild(header);
    content.appendChild(desc);
    content.appendChild(actions);

    card.appendChild(imageContainer);
    card.appendChild(content);

    return card;
  }

  // Function to get image path based on the imageUrl from JSON
  function getImagePath(imageUrl) {
    // Check if the imageUrl is a valid URL
    if (
      imageUrl &&
      (imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://") ||
        imageUrl.startsWith("images.unsplash.com"))
    ) {
      // If imageUrl starts with images.unsplash.com but not with https://, add the protocol
      if (imageUrl.startsWith("images.unsplash.com")) {
        return "https://" + imageUrl;
      }
      return imageUrl;
    }

    // Fallback image if imageUrl is not valid
    return "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&h=500&fit=crop&q=80";
  }

  // Search functionality with enhanced keyword matching
  searchButton.addEventListener("click", function () {
    performSearch();
  });

  // Function to perform search with keyword variations
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === "") {
      displayRecommendations(travelData);
      return;
    }

    // Create variations of the search term for better matching
    const searchVariations = generateSearchVariations(searchTerm);
    console.log("Search variations:", searchVariations);

    // Filter results based on search variations
    const filteredResults = travelData.filter((item) => {
      // Check if any of the search variations match
      return searchVariations.some((variation) => {
        return (
          // Check name
          item.name.toLowerCase().includes(variation) ||
          // Check description
          item.description.toLowerCase().includes(variation) ||
          // Check type
          (item.type && item.type.toLowerCase().includes(variation)) ||
          // Check country
          (item.country && item.country.toLowerCase().includes(variation)) ||
          // Check keywords
          (item.keywords &&
            item.keywords.some(
              (keyword) =>
                keyword.includes(variation) || variation.includes(keyword)
            ))
        );
      });
    });

    displayRecommendations(filteredResults, searchTerm);

    // Scroll to recommendations section
    document.querySelector(".container").scrollIntoView({ behavior: "smooth" });
  }

  // Function to generate variations of search terms
  function generateSearchVariations(term) {
    const variations = [term];

    // Handle singular/plural variations
    if (term.endsWith("s")) {
      // If term ends with "s", add version without "s" (e.g., beaches -> beach)
      variations.push(term.slice(0, -1));
    } else {
      // If term doesn't end with "s", add version with "s" (e.g., beach -> beaches)
      variations.push(term + "s");
    }

    // Handle common misspellings and variations
    const commonVariations = {
      australia: ["austrailia", "austrialia"],
      sydney: ["sidney"],
      brazil: ["brasil"],
      tokyo: ["tokio"],
      kyoto: ["kioto"],
      beach: ["beech"],
      temple: ["tempal", "tempel"],
    };

    // Add common misspellings if applicable
    for (const [correct, misspellings] of Object.entries(commonVariations)) {
      if (term === correct) {
        variations.push(...misspellings);
      }
      if (misspellings.includes(term)) {
        variations.push(correct);
      }
    }

    // Handle keyword mappings
    const keywordMap = {
      beach: [
        "beaches",
        "coast",
        "coastal",
        "ocean",
        "sea",
        "sand",
        "shores",
        "seaside",
      ],
      temple: [
        "temples",
        "religious",
        "historic",
        "monument",
        "shrine",
        "sacred",
      ],
      city: ["cities", "urban", "metropolitan", "town", "downtown"],
      australia: ["sydney", "melbourne", "aussie", "down under"],
      japan: ["tokyo", "kyoto", "japanese"],
      brazil: ["rio", "são paulo", "sao paulo", "copacabana", "brazilian"],
      india: ["taj mahal", "indian"],
      cambodia: ["angkor wat", "cambodian"],
    };

    // Add mapped variations
    for (const [key, values] of Object.entries(keywordMap)) {
      if (term.includes(key) || values.some((v) => term.includes(v))) {
        variations.push(key);
        variations.push(...values);
      }
    }

    // Remove duplicates and return
    return [...new Set(variations)];
  }

  function clearResults() {
    searchInput.value = "";

    // Add animation class to the button
    resetButton.classList.add("reset-btn-active");

    // Remove the animation class after animation completes
    setTimeout(() => {
      resetButton.classList.remove("reset-btn-active");
    }, 500);

    recommendationsDiv.innerHTML = "";

    // Add a loading indicator
    recommendationsDiv.className = "loading";

    // Show a brief message
    const clearMessage = document.createElement("div");
    clearMessage.className = "clear-message";
    clearMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <p>Results cleared successfully!</p>
    `;
    recommendationsDiv.appendChild(clearMessage);

    // Timeout to show loading indicator and message
    setTimeout(() => {
      // Remove loading state
      recommendationsDiv.classList.remove("loading");
      displayRecommendations(travelData);

      // Scroll back to the top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 800);
  }

  // Reset functionality
  resetButton.addEventListener("click", clearResults);

  // Add keyboard accessibility for the reset button
  resetButton.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      clearResults();
    }
  });

  if (bookNowButton) {
    bookNowButton.addEventListener("click", function () {
      window.location.href = "#recommendations";
    });
  }

  // Handle search
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      performSearch();
    }
  });
});
