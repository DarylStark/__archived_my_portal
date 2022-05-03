class DateTime {
    constructor(date_string, interpret_as_utc = true) {
        if (interpret_as_utc) {
            date_string += ' UTC';
        }

        this.datetime = new Date(date_string);
    }

    days_ago() {
        // Method that returns the amound of days ago this date was
        let now = new Date();
        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let date = new Date(
            this.datetime.getFullYear(),
            this.datetime.getMonth(),
            this.datetime.getDate()
        );
        return Math.ceil((today - date) / (1000 * 3600 * 24));
    }

    database_string() {
        // Method that returns the date as a string for the database
        let s = this.datetime.toISOString();
        return `${s.split('T')[0]} ${s.split('T')[1].split('.')[0]}`;
    }
}

export default DateTime;