import mongoose, { Schema, Document, models } from "mongoose";

export interface IHeroSlide extends Document {
    title: string;
    subtitle: string;
    image: string;
    order: number;
    createdAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
    {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const HeroSlide = models.HeroSlide || mongoose.model<IHeroSlide>("HeroSlide", HeroSlideSchema);

export default HeroSlide;
