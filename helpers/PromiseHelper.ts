export class PromiseHelper {

    static isPromise(object): boolean {
        return object !== null && typeof object === "object" && typeof object.then === "function";
    }

    /**
     * Wait for all promises before rejecting
     */
    static all (promises) {
        return Promise
            .all(promises.map(inspectPromise))
            .then((results: any) => {
                const success = results.filter(result => result.status === "resolved");
                if (results.length === success.length) {
                    return success.map(result => result.result);
                } else {
                    return Promise.reject(
                        results
                            .filter(result => result.status === "rejected")
                            .map(result => result.error)
                    );
                }
            });

        /**
         * Helper function used to return the result of a promise with the corresponding status
         * @param  {Promise} promise
         * @return {Promise<Object>}
         */
        function inspectPromise (promise) {
            return promise.then(
                result => ({
                    result,
                    status: "resolved"
                }),
                error => ({
                    error,
                    status: "rejected"
                })
            );
        }
    }

    static defer() {
        const deferred: any = {};
        const promise = new Promise((resolve, reject) => {
            deferred.resolve = resolve;
            deferred.reject = reject;
        });
        deferred.promise = promise;
        return deferred;
    }
}
