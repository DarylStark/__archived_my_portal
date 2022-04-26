class CommandList {
    constructor() {
        this.commands = [];
        this.notes = [];
    }

    add_command(scope, group, command, title, method) {
        // Add the command
        this.commands.push({
            scope: scope,
            group: group,
            command: command,
            title: title,
            method: method,
            fullname: group + ': ' + title
        });

        // Create the map with possible prefixes
        this.search_prefixes = new Map([
            ['#', 'tags'],
            ['>', 'notes'],
            [':', 'rss'],
        ]);
    }

    sort_method(first, second) {
        if (first.fullname.toLowerCase() > second.fullname.toLowerCase()) {
            return 1;
        }
        return -1;
    }

    get_list(filter) {
        // Default list is the command list
        let lst = this.commands;

        // Check if a prefix is given
        let list = '';
        let prefix = this.search_prefixes.get(filter[0]);
        if (prefix) {
            list = prefix;
            filter = filter.substring(1);
        }

        if (list == 'tags') {
            // TODO: Make this the real tags
            lst = [{ fullname: 'tag1' }, { fullname: 'Routz' }, { fullname: 'tag2' }];
        }

        if (list == 'notes') {
            // TODO: Make this the real notes
            lst = [{ fullname: 'My first note' }, { fullname: 'My second note' }];
        }

        if (list == 'rss') {
            // TODO: Make this the real RSS feeds
            lst = [{ fullname: 'nu.nl newsfeed' }, { fullname: 'Apple nieuws' }];
        }

        // Empty filter; return the complete list
        if (filter == '') {
            return lst.sort(this.sort_method);
        }

        // Returns the command list filtered on text
        filter = filter.toLowerCase();
        let filtered_list
        return lst.filter(function (cmd) {
            let fullname = cmd.fullname.toLowerCase();
            return fullname.includes(filter);
        }).sort(this.sort_method);
    }
};

export default new CommandList;