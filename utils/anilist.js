// anilist.js
import { request, gql } from 'graphql-request';

const API_URL = 'https://graphql.anilist.co';

export async function getFilteredAnime({ status, genre, service, minScore, year, minEpisodes, maxEpisodes }) {
  const query = gql`
    query ($status: MediaStatus, $genre: [String], $page: Int) {
      Page(page: $page, perPage: 30) {
        media(
          sort: SCORE_DESC
          type: ANIME
          status: $status
          genre_in: $genre
        ) {
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          description(asHtml: false)
          averageScore
          genres
          status
          episodes
          startDate {
            year
          }
          externalLinks {
            site
            url
          }
        }
      }
    }
  `;

  const variables = {
    status: status || undefined,
    genre: genre ? [genre] : undefined,
    page: 1,
  };

  const data = await request(API_URL, query, variables);

  let filtered = data.Page.media;

  if (minScore) {
    filtered = filtered.filter(anime => anime.averageScore >= parseInt(minScore));
  }

  if (service) {
    filtered = filtered.filter(anime =>
      anime.externalLinks.some(link =>
        link.site.toLowerCase().includes(service.toLowerCase())
      )
    );
  }

  if (year) {
    filtered = filtered.filter(anime => anime.startDate?.year === parseInt(year));
  }

  if (minEpisodes) {
    filtered = filtered.filter(anime => anime.episodes >= parseInt(minEpisodes));
  }

  if (maxEpisodes) {
    filtered = filtered.filter(anime => anime.episodes <= parseInt(maxEpisodes));
  }

  return filtered;
}

export async function getTopRatedAnime() {
  const query = gql`
    query {
      Page(perPage: 10) {
        media(sort: SCORE_DESC, type: ANIME) {
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          description(asHtml: false)
          averageScore
          genres
          status
          externalLinks {
            site
            url
          }
        }
      }
    }
  `;
  const data = await request(API_URL, query);
  return data.Page.media;
}

