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
        return (today - date) / (1000 * 3600 * 24);
    }
}

export default DateTime;