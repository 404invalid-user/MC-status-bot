module.exports = {
    name: 'ip',
    async execute(message, args, data) {
        // Fetch data from db
        // By using redis caching this function's execution time dropped from a average of 29ms to less then one
        if (!data.IP) {
            message.channel.send('This server doest have a default ip set! A admin can do that by using the `mc!setip` command.')
        } else {
            if (data.Bedrock == true) message.channel.send("This server's default ip is `" + data.IP + '`. This is a bedrock server.')
            else message.channel.send("This server's default ip is `" + data.IP + '` This is a java server.')
        }
    }
}
