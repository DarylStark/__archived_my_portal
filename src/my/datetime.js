class DateTime {
    constructor(date_string, interpret_as_utc = true) {
        this.datetime = new Date(date_string);
        if (interpret_as_utc)
            this.datetime = new Date(Date.UTC(
                this.datetime.getFullYear(), this.datetime.getMonth(), this.datetime.getDate(),
                this.datetime.getHours(), this.datetime.getMinutes(), this.datetime.getSeconds())
            );
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

    as_local_datetime() {
        let l = new DateTime(
            this.datetime.toLocaleString(), false
        )
        return l;
    }

    format(format) {
        let date = format;

        // Format the date
        date = date.replace('%Y', this.datetime.getFullYear());
        date = date.replace('%m', this.datetime.getMonth() < 10 ? '0' + this.datetime.getMonth() : this.datetime.getMonth());
        date = date.replace('%d', this.datetime.getDay() < 10 ? '0' + this.datetime.getDay() : this.datetime.getDay());

        // Format the time
        date = date.replace('%H', this.datetime.getHours() < 10 ? '0' + this.datetime.getHours() : this.datetime.getHours());
        date = date.replace('%M', this.datetime.getMinutes() < 10 ? '0' + this.datetime.getMinutes() : this.datetime.getMinutes());
        date = date.replace('%S', this.datetime.getSeconds() < 10 ? '0' + this.datetime.getSeconds() : this.datetime.getSeconds());

        // Return the value
        return date;
    }
}

export default DateTime;