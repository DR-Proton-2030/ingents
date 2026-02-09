import { FacebookDashboardResponse } from "./types";

export const MOCK_FB_DATA: FacebookDashboardResponse = {
  success: true,
  result: {
    page: {
      id: "516127121587407",
      name: "One Shot Coder",
      about: "Empowering coders, one line at a time! One Shot Coder brings quick tips, tutorials, and real-world project-based learning.",
      fan_count: 1432,
      link: "https://www.facebook.com/516127121587407",
      cover: {
        cover_id: "122103271784714717",
        offset_x: 50,
        offset_y: 62,
        source: "https://picsum.photos/1200/400"
      },
      category: "Science & Tech",
      picture: {
        data: {
          url: "https://picsum.photos/200"
        }
      }
    },

    overview: {
      views: 3241,
      views3s: 2318,
      views1m: 642,
      watchTime: 8120,
      threeSecondViewsUnavailable: false,
      oneMinuteViewsUnavailable: false,
      followersGained: 74,
      followersLost: 19,
      netFollowers: 55,
      viewsOverTime: [
        { date: "2026-01-12", views: 34 },
        { date: "2026-01-13", views: 41 },
        { date: "2026-01-14", views: 58 },
        { date: "2026-01-15", views: 71 },
        { date: "2026-01-16", views: 49 },
        { date: "2026-01-17", views: 64 },
        { date: "2026-01-18", views: 77 },
        { date: "2026-01-19", views: 89 },
        { date: "2026-01-20", views: 102 },
        { date: "2026-01-21", views: 95 },
        { date: "2026-01-22", views: 88 },
        { date: "2026-01-23", views: 104 },
        { date: "2026-01-24", views: 117 },
        { date: "2026-01-25", views: 136 },
        { date: "2026-01-26", views: 142 },
        { date: "2026-01-27", views: 151 },
        { date: "2026-01-28", views: 164 },
        { date: "2026-01-29", views: 172 },
        { date: "2026-01-30", views: 180 },
        { date: "2026-01-31", views: 195 },
        { date: "2026-02-01", views: 210 },
        { date: "2026-02-02", views: 224 },
        { date: "2026-02-03", views: 241 },
        { date: "2026-02-04", views: 258 },
        { date: "2026-02-05", views: 276 },
        { date: "2026-02-06", views: 298 },
        { date: "2026-02-07", views: 314 },
        { date: "2026-02-08", views: 329 }
      ],
      topContent: [
        {
          id: "post_1",
          title: "React Hooks Explained in 60 Seconds",
          views: 812,
          watchTime: 1432
        },
        {
          id: "post_2",
          title: "Node.js Project Structure for Startups",
          views: 694,
          watchTime: 1218
        },
        {
          id: "post_3",
          title: "MERN Stack Roadmap 2026",
          views: 543,
          watchTime: 987
        }
      ]
    },

    content: {
      totalViews: 2764,
      publishedContent: [
        {
          id: "content_1",
          title: "React Hooks Explained",
          thumbnail: "https://picsum.photos/seed/1/300/200",
          publishedAt: "2026-01-18T10:00:00Z",
          views: 812
        },
        {
          id: "content_2",
          title: "Node.js Folder Structure",
          thumbnail: "https://picsum.photos/seed/2/300/200",
          publishedAt: "2026-01-20T11:30:00Z",
          views: 694
        },
        {
          id: "content_3",
          title: "MongoDB Schema Design Tips",
          thumbnail: "https://picsum.photos/seed/3/300/200",
          publishedAt: "2026-01-23T09:15:00Z",
          views: 612
        },
        {
          id: "content_4",
          title: "JavaScript Performance Tricks",
          thumbnail: "https://picsum.photos/seed/4/300/200",
          publishedAt: "2026-01-27T14:45:00Z",
          views: 646
        }
      ],
      viewerTypeUnavailable: true,
      viewerTypes: []
    },

    engagement: {
      totals: {
        reactions: 243,
        comments: 61,
        shares: 38,
        total: 342
      },
      engagementOverTimeUnavailable: true
    },

    audience: {
      followers: 1432,
      totalViews: 3241,
      watchTimeSplitUnavailable: true,
      watchTimeSplit: [
        { "label": "Followers", "value": 42 },
        { "label": "Non-followers", "value": 58 }
      ],
      demographics: {
        ageGender: [
          { "age": "18-24", "male": 18, "female": 16 },
          { "age": "25-34", "male": 28, "female": 24 },
          { "age": "35-44", "male": 7, "female": 5 },
          { "age": "45-54", "male": 1, "female": 1 },
          { "age": "55+", "male": 0.5, "female": 0.5 }
        ],
        countries: [
          { "name": "India", "percent": 72 },
          { "name": "Bangladesh", "percent": 10 },
          { "name": "Pakistan", "percent": 7 },
          { "name": "Nepal", "percent": 6 },
          { "name": "Other", "percent": 5 }
        ],
        cities: [
          { "name": "Kolkata", "percent": 31 },
          { "name": "Delhi", "percent": 22 },
          { "name": "Dhaka", "percent": 15 },
          { "name": "Mumbai", "percent": 12 },
          { "name": "Other", "percent": 20 }
        ]
      }
    },

    trafficSources: {
      sources: [
        { "source": "Feed", "percentage": 54 },
        { "source": "Page", "percentage": 21 },
        { "source": "Video", "percentage": 15 },
        { "source": "Unknown", "percentage": 10 }
      ],
      trafficSourcesUnavailable: false,
      reason: ""
    },

    impressions: {
      impressionsUnavailable: true,
      reason: "Not available via Meta Graph API",
      impressions: 0,
      ctr: 0,
      watchTimeFromImpressions: 0
    }
  }
};
