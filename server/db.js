const Chance = require("chance");

const getDb = () => {
    const store = {};
    const dbChance = new Chance("test");
    const generateNItems = (n, getItem) => {
        return dbChance
            .n(dbChance.guid, n)
            .map(id => {
                const subChance = new Chance(id);
                const item = getItem(subChance);
                return Object.assign(
                    {
                        id
                    },
                    item
                );
            })
            .reduce((memo, item) => {
                memo[item.id] = item;
                return memo;
            }, {});
    };

    const getId = () => dbChance.guid();

    const widgets = generateNItems(20, chance => ({
        name: chance.sentence({ words: 3 }),
        cost: chance.integer({ min: 5, max: 5000 })
    }));
    const companies = {
        "1": {
            id: "1",
            name: "ACME Corporation",
            averageCost: 500
        }
    };

    const users = {
        "1": {
            id: "1",
            name: "Clay Branch"
        }
    };

    const delayedReturn = output => {
        return new Promise(resolve => {
            setTimeout(() => resolve(output), 400);
        });
    };

    const wrapMethod = func => (...args) => {
        const result = func(...args);
        return delayedReturn(result);
    };

    const getCollection = (data, key) => {
        store[key] = data;
        return {
            insert: wrapMethod(item => {
                const id = getId();
                const newItem = Object.assign(
                    {
                        id
                    },
                    item
                );
                store[key][id] = newItem;
                return newItem;
            }),
            update: wrapMethod((id, fields) => {
                const oldItem = store[key][id]
                const updatedItem = Object.assign(
                    {},
                    oldItem,
                    {
                        name : fields.name || oldItem.name,
                        cost: fields.cost || oldItem.cost,
                    }
                );
                store[key][id] = updatedItem
                return updatedItem
            }),
            find: wrapMethod(getItems => {
                const findItems = getItems ? getItems : items => items;
                const indexedItems = store[key];
                const itemArray = Object.keys(indexedItems).map(
                    id => indexedItems[id]
                );
                return findItems(itemArray);
            }),
            findById: wrapMethod(id => store[key][id])
        };
    };

    return {
        widgets: getCollection(widgets, "widgets"),
        companies: getCollection(companies, "companies"),
        users: getCollection(users, "users")
    };
};

module.exports = getDb;
