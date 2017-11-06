const mongodb = require('mongodb');
const assert = require('assert');

const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/tutorial';

const dateMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
};
let count = 0;

MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    aggrageByDate(db);
});

function convertDate(db) {
    const companiesColl = db.collection('companies');

    companiesColl.find({
        created_at: {
            $type: 2
        }
    }).forEach((doc) => {
        assert.equal(null, err);
        if (doc.created_at) {
            let createdAtArr = doc.created_at.split(' ');
            let timeArr = createdAtArr[3].split(':');
            let createdAt = new Date(Date.UTC(createdAtArr[5], dateMap[createdAtArr[1]], createdAtArr[2], timeArr[0], timeArr[1], timeArr[2]));
            doc.created_at = createdAt;
            companiesColl.save(doc);
            console.log(++count);
        }
    });
}

function aggrageByDate(db) {
    const companiesColl = db.collection('companies');

    companiesColl.aggregate([{
                $group: {
                    _id: {
                        year: {
                            $year: '$created_at'
                        },
                        month: {
                            $month: '$created_at'
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ])
        .toArray((err, res) => {
            assert.equal(null, err);
            console.log(res);
        });
}