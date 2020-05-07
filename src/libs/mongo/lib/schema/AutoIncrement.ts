import mongoose from "mongoose"
import AutoIncrementType from "../type/AutoIncrement"

export default class AutoIncrementSchema extends mongoose.SchemaType {
  cast(v) {
    return new AutoIncrementType(v);
  }
}
