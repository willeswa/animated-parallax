
const constructionImages: {url: string, department: string}[] = [
    {
        department: 'kitchen',
        url: "https://images.freeimages.com/images/large-previews/203/church-1222702.jpg"
    },
    {
        department: 'bedroom',
        url:     'https://images.freeimages.com/images/large-previews/dbd/flower-1400637.jpg',
    },
    {
        department: "livingroom",
        url: "https://images.freeimages.com/images/large-previews/03e/oxford-architecture-1233371.jpg"
    },
    {
        department: "poach",
        url: "https://images.freeimages.com/images/large-previews/83f/paris-1213603.jpg"
    },
    {
        department: "bathroom",
        url: "https://images.freeimages.com/images/large-previews/3cb/the-treasure-1203251.jpg"
    },
    {
        department: "office",
        url: "https://images.freeimages.com/images/large-previews/42f/petra-1-1214477.jpg"
    },
    {
        department: "garage",
        url: "https://images.freeimages.com/images/large-previews/684/outdoor-architecture-1221857.jpg"
    },
    {
        department: "bedding",
        url: "https://images.freeimages.com/images/large-previews/f12/bedroom-1536256.jpg"
    }
    
];


export const data = constructionImages.map(({url, department}) => ({
    url,
    department,

}))

export type ItemDataType = typeof data[0];