package com.example.myapp.todo.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverters
import com.google.gson.annotations.JsonAdapter
import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import com.squareup.moshi.JsonQualifier
import java.sql.Timestamp
import java.util.Date
@Entity(tableName = "items")
data class Item(
    @PrimaryKey
    val _id: String = "",
                val title: String = "",
    @TypeConverters(DateConverter::class)
    //@Json(name = DateAdapter::class)
    //@JsonAdapter(value = DateAdapter::class)
    //val date: Date = Date(2002, 6, 23),
    val date: String = "2002-06-23",
    //val date: Timestamp = Timestamp(2002, 6, 23, 0, 0, 0, 0),
    val review: Int = 1,
    val watched: Boolean = false,
    var latitude: Double=46.76948136413,
    var longitude: Double=23.624474555253983
)