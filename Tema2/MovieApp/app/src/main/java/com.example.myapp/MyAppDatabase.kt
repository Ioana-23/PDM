package com.example.myapp

import com.example.myapp.todo.data.DateConverter
import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.example.myapp.todo.data.Item
import com.example.myapp.todo.data.local.ItemDao

@Database(entities = arrayOf(Item::class), version = 1)
//@TypeConverters(DateConverter::class)
abstract class MyAppDatabase : RoomDatabase() {
    abstract fun itemDao(): ItemDao

    companion object {
        @Volatile
        private var INSTANCE: MyAppDatabase? = null

        fun getDatabase(context: Context): MyAppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context,
                    MyAppDatabase::class.java,
                    "app_database"
                )
                    //.addTypeConverter(DateConverter())
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
