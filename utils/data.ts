import { faker } from '@faker-js/faker';

const constructionImages: {image: string, category: string}[] = [
    {
        category: 'CULTURE',
        image: "https://images.freeimages.com/images/large-previews/203/church-1222702.jpg"
    },
    {
        category: 'FOOD',
        image: "https://bloximages.newyork1.vip.townnews.com/feastmagazine.com/content/tncms/assets/v3/editorial/d/45/d45bce7a-a81a-11e5-9161-5b2fba97d18a/567856c261096.image.jpg"
    },
    {
        category: "HISTORICAL",
        image: "https://images.freeimages.com/images/large-previews/03e/oxford-architecture-1233371.jpg"
    },
    {
        category: "ADVENTURE",
        image: "https://www.visitmyrtlebeach.com/sites/default/files/styles/hero_mobile/public/2023-08/newback.jpg.webp?itok=tqRmsg8g"
    },
    {
        category: "NIGHTLIFE",
        image: "https://images.freeimages.com/images/large-previews/3cb/the-treasure-1203251.jpg"
    },
    {
        category: "NATURE",
        image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/a3/14/9d/walterboro-wildlife-sanctuary.jpg?w=1400&h=1400&s=1"
    },
    {
        category: "FAMILY",
        image: "https://images.freeimages.com/images/large-previews/684/outdoor-architecture-1221857.jpg"
    },
   
    
];


export const data = constructionImages.map(({image, category}) => ({
    image,
    category,
    key: faker.string.uuid(),
    peek: {
        description: faker.lorem.sentence(),
        key_stat: faker.lorem.sentence(),
        top_choices: [
            {
                name: faker.location.streetAddress(),
                rating: faker.number.int({min: 1, max: 5}),
            },
            {
                name: faker.location.streetAddress(),
                rating: faker.number.int({min: 1, max: 5}),
            },
            {
                name: faker.location.streetAddress(),
                rating: faker.number.int({min: 1, max: 5}),
            },
            {
                name: faker.location.streetAddress(),
                rating: faker.number.int({min: 1, max: 5}),
            }
        ]
    }

}))

export type ItemDataType = typeof data[0];