import { HydratedDocument, Model, Schema, model, models } from 'mongoose';
import { FilmDetailsDto, ScheduleDto } from '../dto/films.dto';

const scheduleSchema = new Schema<ScheduleDto>(
  {
    id: { type: String, required: true },
    daytime: { type: String, required: true },
    hall: { type: Number, required: true },
    rows: { type: Number, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    taken: { type: [String], default: [] },
  },
  { _id: false, id: false },
);

export const filmSchema = new Schema<FilmDetailsDto>(
  {
    id: { type: String, required: true, unique: true, index: true },
    rating: { type: Number, required: true },
    director: { type: String, required: true },
    tags: { type: [String], default: [] },
    image: { type: String, required: true },
    cover: { type: String, required: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    description: { type: String, required: true },
    schedule: { type: [scheduleSchema], default: [] },
  },
  {
    collection: 'films',
    id: false,
    versionKey: false,
  },
);

export type FilmDocument = HydratedDocument<FilmDetailsDto>;

export const FilmModel: Model<FilmDetailsDto> =
  (models.Film as Model<FilmDetailsDto>) ||
  model<FilmDetailsDto>('Film', filmSchema, 'films');
