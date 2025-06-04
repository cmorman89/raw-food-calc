const modesOfFood = {
    BARF:   {
        Adult: [
            { name: "MuscleMeat", percentage: 70 },
            { name: "BoneyMeat", percentage: 10 },
            { name: "Liver", percentage: 5 },
            { name: "OrganMeat", percentage: 5 },
            { name: "Veggie", percentage: 7 },
            { name: "Fruit", percentage: 1 },
            { name: "Seeds", percentage: 2 }

        ],
        Puppy: [
            { name: "MuscleMeat", percentage: 58 },
            { name: "BoneyMeat", percentage: 17 },
            { name: "Liver", percentage: 7 },
            { name: "OrganMeat", percentage: 7 },
            { name: "Veggie", percentage: 7 },
            { name: "Fruit", percentage: 1 },
            { name: "Seeds", percentage: 3 }

        ]
    }
    
    ,PMR:   {
        Adult: [
            { name: "MuscleMeat", percentage: 78 },
            { name: "BoneyMeat", percentage: 10 },
            { name: "LiverMeat", percentage: 5 },
            { name: "OrganMeat", percentage: 5 },
            { name: "Fibre", percentage: 2 }

        ],
        Puppy: [
            { name: "MuscleMeat", percentage: 67 },
            { name: "BoneyMeat", percentage: 17 },
            { name: "LiverMeat", percentage: 7 },
            { name: "OrganMeat", percentage: 7 },
            { name: "Fibre", percentage: 2 }

        ]
    }

    ,tradBARF:   {
        Adult: [
            { name: "MuscleMeat", percentage: 70 },
            { name: "BoneyMeat", percentage: 10 },
            { name: "LiverMeat", percentage: 5 },
            { name: "OrganMeat", percentage: 5 },
            { name: "Veggie", percentage: 10 }

        ],
        Puppy: [
            { name: "MuscleMeat", percentage: 58 },
            { name: "BoneyMeat", percentage: 17 },
            { name: "LiverMeat", percentage: 7 },
            { name: "OrganMeat", percentage: 7 },
            { name: "Veggie", percentage: 10 }

        ]
    }
    
    ,tradPMR:   {
        Adult: [
            { name: "MuscleMeat", percentage: 80 },
            { name: "BoneyMeat", percentage: 10 },
            { name: "LiverMeat", percentage: 5 },
            { name: "OrganMeat", percentage: 5 }
        ],
        Puppy: [
            { name: "MuscleMeat", percentage: 69 },
            { name: "BoneyMeat", percentage: 17 },
            { name: "LiverMeat", percentage: 7 },
            { name: "OrganMeat", percentage: 7 }
        ]
    }
};

module.exports = modesOfFood;