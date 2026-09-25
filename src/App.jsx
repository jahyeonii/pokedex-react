import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const TYPE_ENERGY_ICONS = {
  grass: "🌿",
  fire: "🔥",
  water: "💧",
  electric: "⚡",
  psychic: "🔮",
  fighting: "🥊",
  dark: "🌙",
  steel: "⚙️",
  fairy: "✨",
  normal: "⚪",
  poison: "☠️",
  ground: "🏜️",
  bug: "🐛",
  rock: "🪨",
  ghost: "👻",
  ice: "❄️",
  dragon: "🐉",
};

const TYPE_COMBAT_RELATIONS = {
  grass: { weakness: "fire", resistance: "water" },
  fire: { weakness: "water", resistance: "grass" },
  water: { weakness: "electric", resistance: "fire" },
  electric: { weakness: "fighting", resistance: "steel" },
  psychic: { weakness: "dark", resistance: "fighting" },
  fighting: { weakness: "psychic", resistance: "dark" },
  dark: { weakness: "fighting", resistance: "psychic" },
  steel: { weakness: "fire", resistance: "poison" },
  fairy: { weakness: "steel", resistance: "dark" },
  normal: { weakness: "fighting", resistance: "none" },
  poison: { weakness: "psychic", resistance: "grass" },
  ground: { weakness: "water", resistance: "electric" },
  bug: { weakness: "fire", resistance: "fighting" },
  rock: { weakness: "grass", resistance: "normal" },
  ghost: { weakness: "dark", resistance: "normal" },
  ice: { weakness: "fire", resistance: "ice" },
  dragon: { weakness: "fairy", resistance: "water" },
};

const TYPE_COLORS = {
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  psychic: "#F85888",
  fighting: "#C03028",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  normal: "#A8A878",
  poison: "#A040A0",
  ground: "#E0C068",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  ice: "#98D8D8",
  dragon: "#7038F8",
};

const PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%231e293b' stroke='%23475569' stroke-width='6'/><path d='M 5,50 A 45,45 0 0,1 95,50 Z' fill='%23ef4444'/><line x1='5' y1='50' x2='95' y2='50' stroke='%230f172a' stroke-width='8'/><circle cx='50' cy='50' r='14' fill='%230f172a'/><circle cx='50' cy='50' r='8' fill='%23ffffff'/></svg>";

function getImageSources(id, shiny) {
  const shinyPath = shiny ? "shiny/" : "";

  return [
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${id}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${shinyPath}${id}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${id}.png`,
    PLACEHOLDER,
  ];
}

function PokemonImage({ id, name, shiny, className = "" }) {
  const sources = getImageSources(id, shiny);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [id, shiny]);

  return (
    <img
      className={className}
      src={sources[imageIndex]}
      alt={name}
      loading="lazy"
      onError={() => {
        setImageIndex((current) =>
          Math.min(current + 1, sources.length - 1)
        );
      }}
    />
  );
}

function PokemonCard({
  pokemon,
  shiny,
  onShiny,
  favorite,
  onFavorite,
  onOpen,
}) {
  return (
    <div
      className="pokemon-card"
      onClick={() => onOpen(pokemon.id)}
    >
      <div className="card-top">
        <button
          className={`favorite-button ${
            favorite ? "active" : ""
          }`}
          onClick={(event) => {
            event.stopPropagation();
            onFavorite(pokemon.id);
          }}
        >
          ♥
        </button>

        <span className="pokemon-id">
          #{String(pokemon.id).padStart(3, "0")}
        </span>
      </div>

      <div className="pokemon-image-container">
        <PokemonImage
          id={pokemon.id}
          name={pokemon.name}
          shiny={shiny}
          className="pokemon-image"
        />
      </div>

      <h3>{pokemon.name}</h3>

      {/* Type Pills Container */}
      <div className="card-types">
        {pokemon.types?.map((type) => (
          <span
            key={type}
            className="type-pill"
            style={{
              backgroundColor: TYPE_COLORS[type] || "#A8A878",
            }}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

function TcgCard({ pokemon, shiny }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  const sources = getImageSources(pokemon.id, shiny);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [pokemon.id, shiny]);

  const energy =
    TYPE_ENERGY_ICONS[pokemon.primaryType] || "⚪";

  const weakness =
    TYPE_ENERGY_ICONS[pokemon.combat.weakness] || "⚔️";

  function handleMouseMove(event) {
    const card = cardRef.current;
    const glare = glareRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX =
      ((y - rect.height / 2) /
        (rect.height / 2)) *
      -20;

    const rotateY =
      ((x - rect.width / 2) /
        (rect.width / 2)) *
      20;

    card.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.04)
    `;

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      glare.style.background = `
        radial-gradient(
          circle at ${glareX}% ${glareY}%,
          rgba(255,255,255,.75),
          rgba(255,255,255,.2) 35%,
          transparent 70%
        )
      `;
    }
  }

  function resetCard() {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "rotateX(0deg) rotateY(0deg) scale(1)";
    }
  }

  return (
    <div className="tcg-perspective">
      <div
        ref={cardRef}
        className="tcg-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetCard}
      >
        <div
          ref={glareRef}
          className="tcg-glare"
        />

        <div
          className={`tcg-inner bg-${pokemon.primaryType}`}
        >
          <div className="tcg-header">
            <div>
              <span className="tcg-basic">
                BASIC
              </span>

              <h2>{pokemon.name}</h2>
            </div>

            <div className="tcg-hp">
              <span>HP</span>
              <strong>{pokemon.hp}</strong>
              <span>{energy}</span>
            </div>
          </div>

          <div className="tcg-art">
            <img
              src={sources[imageIndex]}
              alt={pokemon.name}
              onError={() => {
                setImageIndex((current) =>
                  Math.min(
                    current + 1,
                    sources.length - 1
                  )
                );
              }}
            />
          </div>

          <div className="tcg-subtitle">
            NO. {pokemon.id} HT:{" "}
            {pokemon.height}m WT:{" "}
            {pokemon.weight}kg
          </div>

          <div className="ability">
            <span>ABILITY</span>
            <strong>{pokemon.ability}</strong>
          </div>

          <div className="moves">
            <div className="move">
              <span>
                {energy} {pokemon.move1?.name}
              </span>

              <strong>
                {pokemon.move1?.power || 0}
              </strong>
            </div>

            <div className="move">
              <span>
                {energy} {energy}{" "}
                {pokemon.move2?.name}
              </span>

              <strong>
                {pokemon.move2?.power || 0}
              </strong>
            </div>
          </div>

          <div className="tcg-divider" />

          <div className="combat-info">
            <div>
              <small>WEAKNESS</small>
              <span>{weakness} ×2</span>
            </div>

            <div>
              <small>RESISTANCE</small>
              <span>
                {pokemon.combat.resistance !==
                "none"
                  ? "-20"
                  : "none"}
              </span>
            </div>

            <div>
              <small>RETREAT COST</small>
              <span>
                {"⚪ ".repeat(
                  pokemon.retreatCost
                )}
              </span>
            </div>
          </div>

          <div className="tcg-footer">
            <span>
              #{String(pokemon.id).padStart(3, "0")}
            </span>

            <span>Illus. Game Freak</span>

            <span>©2026 Pokémon/Nintendo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PokemonModal({
  pokemon,
  shiny,
  onClose,
}) {
  if (!pokemon) return null;

  const stats = [
    ["HP", pokemon.stats.hp],
    ["Attack", pokemon.stats.attack],
    ["Defense", pokemon.stats.defense],
    [
      "Sp. Attack",
      pokemon.stats.specialAttack,
    ],
    [
      "Sp. Defense",
      pokemon.stats.specialDefense,
    ],
    ["Speed", pokemon.stats.speed],
  ];

  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <button
          className="close-button"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="modal-content">
          <div className="modal-card">
            <TcgCard
              pokemon={pokemon}
              shiny={shiny}
            />

            <p className="card-hint">
              ☝ Move your mouse over the
              card
            </p>
          </div>

          <div className="pokemon-details">
            <div className="details-header">
              <div>
                <span className="inspector">
                  Pokédex Inspector
                </span>

                <h2>{pokemon.name}</h2>
              </div>

              <span className="details-id">
                #{pokemon.id}
              </span>
            </div>

            <div className="lore-box">
              <span>Species Entry</span>

              <p>
                "{pokemon.lore}"
              </p>
            </div>

            <div className="info-grid">
              <div>
                <span>HEIGHT</span>
                <strong>
                  {pokemon.height} m
                </strong>
              </div>

              <div>
                <span>WEIGHT</span>
                <strong>
                  {pokemon.weight} kg
                </strong>
              </div>

              <div>
                <span>TYPE</span>
                <strong>
                  {pokemon.primaryType}
                </strong>
              </div>
            </div>

            <div className="stats-box">
              <span className="stats-title">
                Base Video Game Stats
              </span>

              {stats.map(
                ([label, value]) => (
                  <div
                    className="stat-row"
                    key={label}
                  >
                    <span className="stat-name">
                      {label}
                    </span>

                    <div className="stat-bar">
                      <div
                        className="stat-fill"
                        style={{
                          width: `${Math.min(
                            (value / 180) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <strong>
                      {value}
                    </strong>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [pokemon, setPokemon] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedType, setSelectedType] =
    useState("all");

  const [shiny, setShiny] =
    useState(false);

  const [favorites, setFavorites] =
    useState(() => {
      try {
        return (
          JSON.parse(
            localStorage.getItem(
              "pokemon-favorites"
            )
          ) || []
        );
      } catch {
        return [];
      }
    });

  const [favoritesOnly, setFavoritesOnly] =
    useState(false);

  const [selectedPokemon, setSelectedPokemon] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        // Fetch type list from PokeAPI to map Pokémon to types efficiently
        const typesResponse = await fetch("https://pokeapi.co/api/v2/type");
        const typesData = await typesResponse.json();

        // Object map: pokemonName -> Array of type names
        const typeMap = {};

        await Promise.all(
          typesData.results.map(async (t) => {
            const res = await fetch(t.url);
            const data = await res.json();
            data.pokemon.forEach((p) => {
              if (!typeMap[p.pokemon.name]) {
                typeMap[p.pokemon.name] = [];
              }
              typeMap[p.pokemon.name].push(t.name);
            });
          })
        );

        const listResponse = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const listData = await listResponse.json();

        const pokemonList = listData.results.map((item, index) => ({
          id: index + 1,
          name: item.name,
          types: typeMap[item.name] || ["normal"],
        }));

        setPokemon(pokemonList);
      } catch (err) {
        setError("Failed to load Pokémon.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllPokemon();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "pokemon-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  const filteredPokemon = useMemo(() => {
    const query =
      search.toLowerCase().trim();

    return pokemon.filter((item) => {
      const matchesSearch =
        item.name.includes(query) ||
        String(item.id) === query;

      const matchesFavorites =
        !favoritesOnly ||
        favorites.includes(item.id);

      const matchesType =
        selectedType === "all" ||
        item.types.includes(selectedType);

      return (
        matchesSearch &&
        matchesFavorites &&
        matchesType
      );
    });
  }, [
    pokemon,
    search,
    selectedType,
    favoritesOnly,
    favorites,
  ]);

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter(
            (favoriteId) =>
              favoriteId !== id
          )
        : [...current, id]
    );
  }

  async function openPokemon(id) {
    const basicPokemon =
      pokemon.find(
        (item) => item.id === id
      );

    if (!basicPokemon) return;

    setSelectedPokemon({
      id,
      name: basicPokemon.name,
      primaryType: basicPokemon.types[0] || "normal",
      hp: 60,
      height: 1,
      weight: 10,
      ability: "Overgrow",
      move1: {
        name: "Tackle",
        power: 30,
      },
      move2: {
        name: "Quick Attack",
        power: 50,
      },
      combat: {
        weakness: "fighting",
        resistance: "none",
      },
      retreatCost: 1,
      stats: {
        hp: 60,
        attack: 50,
        defense: 50,
        specialAttack: 50,
        specialDefense: 50,
        speed: 50,
      },
      lore: "Loading species information...",
    });

    try {
      const [
        pokemonResponse,
        speciesResponse,
      ] = await Promise.all([
        fetch(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        ).then((response) =>
          response.json()
        ),

        fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        ).then((response) =>
          response.json()
        ),
      ]);

      const attack =
        pokemonResponse.stats.find(
          (stat) =>
            stat.stat.name === "attack"
        )?.base_stat || 50;

      const weight =
        pokemonResponse.weight / 10;

      const type =
        pokemonResponse.types[0]?.type
          ?.name || "normal";

      const stats = {
        hp:
          pokemonResponse.stats.find(
            (stat) =>
              stat.stat.name === "hp"
          )?.base_stat || 0,

        attack,

        defense:
          pokemonResponse.stats.find(
            (stat) =>
              stat.stat.name ===
              "defense"
          )?.base_stat || 0,

        specialAttack:
          pokemonResponse.stats.find(
            (stat) =>
              stat.stat.name ===
              "special-attack"
          )?.base_stat || 0,

        specialDefense:
          pokemonResponse.stats.find(
            (stat) =>
              stat.stat.name ===
              "special-defense"
          )?.base_stat || 0,

        speed:
          pokemonResponse.stats.find(
            (stat) =>
              stat.stat.name === "speed"
          )?.base_stat || 0,
      };

      const details = {
        id: pokemonResponse.id,
        name: pokemonResponse.name,
        primaryType: type,
        hp: stats.hp,
        height:
          pokemonResponse.height / 10,
        weight,

        ability:
          pokemonResponse.abilities[0]?.ability.name.replaceAll(
            "-",
            " "
          ) || "Special Ability",

        move1: {
          name:
            pokemonResponse.moves[0]?.move.name.replaceAll(
              "-",
              " "
            ) || "Tackle",

          power: Math.floor(
            attack * 0.6
          ),
        },

        move2: {
          name:
            pokemonResponse.moves[1]?.move.name.replaceAll(
              "-",
              " "
            ) || "Quick Attack",

          power: Math.floor(
            attack * 1.1
          ),
        },

        combat:
          TYPE_COMBAT_RELATIONS[type] || {
            weakness: "fighting",
            resistance: "none",
          },

        retreatCost:
          weight > 80
            ? 3
            : weight > 25
            ? 2
            : 1,

        stats,

        lore:
          speciesResponse
            .flavor_text_entries
            ?.find(
              (entry) =>
                entry.language.name ===
                "en"
            )
            ?.flavor_text.replace(
              /[\n\f\r]/g,
              " "
            ) ||
          "No species entry available.",
      };

      setSelectedPokemon(details);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand-section">
          <div className="logo">
            POKÉDEX
          </div>

          <span className="count">
            {loading
              ? "Loading 1,025..."
              : `${filteredPokemon.length} Pokémon`}
          </span>
        </div>

        <span className="generations">
           All Generations (1-1025)
        </span>

        <div className="controls">
          <div className="search-container">
            <span>⌕</span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search Pokémon or #ID..."
            />
          </div>

          <select
            className="control-button type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            {Object.keys(TYPE_ENERGY_ICONS).map((type) => (
              <option key={type} value={type}>
                {TYPE_ENERGY_ICONS[type]} {type.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            className={`control-button shiny-button ${
              shiny ? "active" : ""
            }`}
            onClick={() =>
              setShiny(
                (current) => !current
              )
            }
          >
             Shiny{" "}
            {shiny ? "ON" : "OFF"}
          </button>

          <button
            className={`control-button favorites-button ${
              favoritesOnly
                ? "active"
                : ""
            }`}
            onClick={() =>
              setFavoritesOnly(
                (current) => !current
              )
            }
          >
            ♥ Favs ({favorites.length})
          </button>
        </div>
      </header>

      <main>
        {loading && (
          <div className="loader">
            <div className="spinner" />

            <h2>
              Loading All 1,025 Pokémon...
            </h2>

            <p>
              Fetching Pokémon data and types...
            </p>
          </div>
        )}

        {error && (
          <div className="loader">
            <h2>{error}</h2>
          </div>
        )}

        {!loading &&
          !error &&
          filteredPokemon.length > 0 && (
            <div className="pokemon-grid">
              {filteredPokemon.map(
                (item) => (
                  <PokemonCard
                    key={item.id}
                    pokemon={item}
                    shiny={shiny}
                    favorite={favorites.includes(
                      item.id
                    )}
                    onFavorite={
                      toggleFavorite
                    }
                    onOpen={
                      openPokemon
                    }
                  />
                )
              )}
            </div>
          )}

        {!loading &&
          !error &&
          filteredPokemon.length ===
            0 && (
            <div className="no-results">
              <h2>
                No Pokémon found.
              </h2>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedType("all");
                  setFavoritesOnly(false);
                }}
              >
                Reset Search
              </button>
            </div>
          )}
      </main>

      <PokemonModal
        pokemon={selectedPokemon}
        shiny={shiny}
        onClose={() =>
          setSelectedPokemon(null)
        }
      />
    </div>
  );
}