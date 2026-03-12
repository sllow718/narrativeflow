// activities.js
// Provides the workshop scenarios, sticker sets, and metadata used across NarrativeFlow.

const activities = [
  {
    id: "msf-course",
    classCode: "TP-DATA-2026",
    className: "MSF Course",
    scenarioTitle: "National Clothing Retailer Survey Analysis",
    scenarioBrief:
      "You work at a national clothing retailer. You've conducted a survey asking your own customers and the customers of your competitors about various elements related to back-to-school shopping.\n\nYou've analysed the data. You've found there are some areas where your company is performing well, as well as some areas of opportunity. In particular, there are inconsistencies in service across stores.\n\nTogether with your team, you've explored different potential courses of action for dealing with this and would like to recommend solving through sales associate training.",
    masterStickers: [
      { id: "s1", text: "Historically NOT data-driven", color: "blue" },
      {
        id: "s2",
        text: "Ways we considered becoming more data-driven",
        color: "blue",
      },
      {
        id: "s3",
        text: "Back-to-school shopping is important\n (DEMONSTRATE)",
        color: "blue",
      },
      { id: "s4", text: "Survey!", color: "blue" },
      {
        id: "s5",
        text: "What we learned from the data (analysis results)",
        color: "blue",
      },
      {
        id: "s6",
        text: "All the details \n– who we asked \n– who responded \n– competitors \n– etc.",
        color: "blue",
      },
      {
        id: "s7",
        text: "Areas we did well. \nAreas not-so-well.",
        color: "blue",
      },
      {
        id: "s8",
        text: "OPPORTUNITY:\n inconsistencies in service levels",
        color: "blue",
      },
      {
        id: "s9",
        text: "If nothing done, we will lose customers",
        color: "blue",
      },
      {
        id: "s10",
        text: "RECOMMENDATION:\n invest in employee training (+ details)",
        color: "blue",
      },
      { id: "s11", text: "DISCUSSION / APPROVAL", color: "blue" },
    ],
  },
  {
    id: "superstore",
    classCode: "TP-VIZ-2026",
    className: "Superstore Analysis",
    scenarioTitle: "Superstore Sales & Profitability Deep Dive",
    scenarioBrief:
      "You are a data analyst at a large retail superstore chain. Your manager has asked you to investigate declining profitability in certain regions and product categories. Using the Superstore dataset, you will explore patterns, identify problem areas, and present recommendations.",
    masterStickers: [
      {
        id: "s1",
        text: "Line\nFurniture – flat\nTechnology &Office Supplies 📈",
        color: "blue",
      },
      { id: "s2", text: "Map - \nCalifornia 👍\nTexas 👎", color: "blue" },
      { id: "s3", text: "Table\nWest – 👍\nCentral – 👎", color: "blue" },
      {
        id: "s4",
        text: "Table\nTable – East 👎 \nCopiers – West 👍 ",
        color: "blue",
      },
      {
        id: "s5",
        text: "Scatter\nBookcases, Table &\nMachines – Low\nProfit / High Sales",
        color: "blue",
      },
      {
        id: "s6",
        text: "Dashboard\nTables :\nNew York & Illinois 👎\nSharp 📉 fr 2013 to 2014",
        color: "blue",
      },
      {
        id: "s7",
        text: "Dashboard\nTables in 2011\nBest : Virginia\nWorst : New York",
        color: "blue",
      },
      {
        id: "s8",
        text: "Dashboard\nTables in 2012\nBest : Washington\nWorst : N Carolina",
        color: "blue",
      },
      {
        id: "s9",
        text: "Bar\nTable & Machines 📉\nCopiers & Phones 📈",
        color: "blue",
      },
      {
        id: "s10",
        text: "If trend continues → profit for tables will get worse",
        color: "blue",
      },
      {
        id: "s11",
        text: "Dashboard\nTables in 2013\nBest : Washington\nWorst : Arizona",
        color: "blue",
      },
      {
        id: "s12",
        text: "Dashboard\nTables in 2014\nBest : Washington\nWorst : Tennessee",
        color: "blue",
      },
      {
        id: "s13",
        text: "Dashboard\nEast Region : Poor Performance\nWhat is it that Washington is doing right?",
        color: "blue",
      },
      {
        id: "s14",
        text: "Recommendation\n1. Approve to build task force\n2. Find out Washington's good practice\n3. Find reasons for high sales but low profit\n4. Increase profit for Tables by 10%",
        color: "blue",
      },
    ],
  },
];

export default activities;
