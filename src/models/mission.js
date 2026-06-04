export class Mission {
    constructor(data) {
        this.meta = data;
    }

    static mapper(data) {
        return new Mission(data);
    }

    get id() {
        return this.meta.id;
    }

    get name() {
        return this.meta.name;
    }
    get creationDate() {
        return this.meta.creationDate;
    }

    // STATUSES

    get statuses() {
        return this.meta.mediasStatus;
    }
    get containsDone() {
        return this.statuses.includes('DONE');
    }
    get containsError() {
        return this.statuses.includes('ERROR');
    }
    get containsProgress() {
        return this.statuses.includes('PROGRESS');
    }
    get containsPending() {
        return this.statuses.includes('PENDING');
    }
}
