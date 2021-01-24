const moment = require('moment')

const resolvers = {
  Query: {
    viewsInPastMonth: async (root, args, { Wiki }) => {
      const {
        items,
      } = await Wiki.api.getMetricsPageviewsAggregateProjectAccessAgentGranularityStartEnd(
        {
          access: 'all-access',
          agent: 'user',
          end: moment().format('YYYYMMDD'),
          start: moment()
            .startOf('month')
            .subtract(1, 'month')
            .format('YYYYMMDD'),
          project: args.project,
          granularity: 'monthly',
        }
      )

      if (!items || items.length === 0) {
        return 0
      }

      return items[0].views
    },
  },
}

module.exports = { resolvers }
