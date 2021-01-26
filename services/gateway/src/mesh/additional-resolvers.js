const moment = require('moment')

const Discord = require('discord.js')
const client = new Discord.Client()

client.once('ready', () => {
  console.log('Ready!')
})

client.login('ODAyNzY3MTU5NDczNzMzNjMz.YA0BLQ.FngCG5C8duIsxc5P70pwtQsMydU')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', (msg) => {
  if (msg.content === 'ping') {
    msg.reply('Pong!')
  }
})

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
