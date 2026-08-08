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
    get doneNumber() {
        return this.statuses.DONE || 0;
    }
    get errorNumber() {
        return this.statuses.ERROR || 0;
    }
    get progressNumber() {
        return this.statuses.RUNNING || 0;
    }
    get pendingNumber() {
        return this.statuses.PENDING || 0;
    }
}
