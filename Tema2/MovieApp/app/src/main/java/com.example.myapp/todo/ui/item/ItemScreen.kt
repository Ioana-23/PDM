package com.example.myapp.todo.ui

import android.Manifest
import android.app.DatePickerDialog
import android.util.Log
import android.widget.DatePicker
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.FastOutLinearInEasing
import androidx.compose.animation.core.LinearOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.Icon
import androidx.compose.material.IconButton
import androidx.compose.material.MaterialTheme
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextField
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapp.MyApp
import com.example.myapp.R
import com.example.myapp.core.Result
import com.example.myapp.core.util.createNotificationChannel
import com.example.myapp.core.util.showSimpleNotificationWithTapAction
import com.example.myapp.todo.ui.item.ItemViewModel
import com.example.myapp.todo.ui.item.MyFloatingActionButton
import com.example.myapp.todo.ui.item.MyLocation
import com.example.myapp.todo.ui.item.MyMap
import com.example.myapp.ui.theme.MyMapTheme
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.android.gms.maps.model.LatLng
import com.ilazar.mycamera.util.Permissions
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.Date

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemScreen(itemId: String?, onClose: () -> Unit) {
    val itemViewModel = viewModel<ItemViewModel>(factory = ItemViewModel.Factory(itemId))
    val itemUiState = itemViewModel.uiState
    var text by rememberSaveable { mutableStateOf(itemUiState.item.title) }
    var date by rememberSaveable { mutableStateOf(itemUiState.item.date) }
    var review by rememberSaveable { mutableStateOf(itemUiState.item.review) }
    var watched by rememberSaveable { mutableStateOf(itemUiState.item.watched) }
    var id by rememberSaveable { mutableStateOf(itemUiState.itemId) }
    var longitude by rememberSaveable { mutableStateOf(itemUiState.item.longitude) }
    var latitude by rememberSaveable { mutableStateOf(itemUiState.item.latitude) }
    val context = LocalContext.current
    val channelId = "MyTestChannel"
    val notificationId = 0
    var isDeleting by remember { mutableStateOf(false) }
    var isExpanded by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()
    suspend fun showDeleteMessage() {
        if (!isDeleting) {
            isDeleting = true
            delay(3000L)
            isDeleting = false
        }
    }
    LaunchedEffect(Unit) {
        createNotificationChannel(channelId, context)
    }
    Log.d("ItemScreen", "recompose, text = $text, date=$date, review=$review, watched = $watched")

    LaunchedEffect(itemUiState.submitResult) {
        Log.d("ItemScreen", "Submit = ${itemUiState.submitResult}");
        if (itemUiState.submitResult is Result.Success) {
            Log.d("ItemScreen", "Closing screen");
            onClose();
        }
    }

    var textInitialized by remember { mutableStateOf(itemId == null) }
    LaunchedEffect(itemId, itemUiState.loadResult) {
        Log.d("ItemScreen", "Text initialized = ${itemUiState.loadResult}");
        if (textInitialized) {
            return@LaunchedEffect
        }
        if (!(itemUiState.loadResult is Result.Loading)) {
            text = itemUiState.item.title
            date = itemUiState.item.date
            review = itemUiState.item.review
            watched = itemUiState.item.watched
            latitude = itemUiState.item.latitude
            longitude = itemUiState.item.longitude
            textInitialized = true
        }
    }
    Surface (
        //onClick = { isExpanded = !isExpanded }
    ) {
        Scaffold(
            Modifier.padding(PaddingValues(horizontal = 16.dp, vertical = 35.dp)),
            topBar = {
                TopAppBar(
                    title = { Text(text = stringResource(id = R.string.item)) },
                    actions = {
                        Button(onClick = {
                            Log.d("ItemScreen", "save item text = $text, date = $date, review = $review");
                            itemViewModel.saveOrUpdateItem(text, date, review, watched, latitude, longitude)
                            showSimpleNotificationWithTapAction(
                                context,
                                channelId,
                                notificationId,
                                "Item updated",
                                "Item with title $text has been updated"
                            )
                        }) { Text("Save") }
                    }
                )
            },
            floatingActionButton = {
                MyFloatingActionButton(
                    isDeleting = isDeleting,
                    onClick = {
                        coroutineScope.launch {
                            showDeleteMessage()
                        }
                    }
                )
            }
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(it)
                    .animateContentSize())
            {
                if (itemUiState.loadResult is Result.Loading) {
                    CircularProgressIndicator()
                    return@Scaffold
                }
                if (itemUiState.submitResult is Result.Loading) {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) { LinearProgressIndicator() }
                }
                if (itemUiState.loadResult is Result.Error) {
                    Text(text = "Failed to load item - ${(itemUiState.loadResult as Result.Error).exception?.message}")
                }
                Row{
                    IconButton(
                        onClick = { isExpanded = !isExpanded }
                    )
                    {
                        Icon(
                            tint = MaterialTheme.colors.secondary,
                            imageVector = Icons.Default.ArrowDropDown,
                            contentDescription = null
                        )
                    }
                    TextField(
                        value = text,
                        onValueChange = { text = it }, label = { Text("title") },
                    )
                }
                if(isExpanded)
                {
                    Row {
                        Spacer(modifier = Modifier.width(48.dp))
                        TextField(
                            value = date.toString(),
                            onValueChange = { date = /*Date(it.toLong())*/it }, label = { Text("date") },
                        )
                    }
                    Row {
                        Spacer(modifier = Modifier.width(48.dp))
                        TextField(
                            value = review.toString(),
                            onValueChange = { review = if(it != "") it.toInt() else 1 }, label = { Text("review") },
                        )
                    }
                    Row {
                        Spacer(modifier = Modifier.width(48.dp))
                        Checkbox(
                            checked = watched,
                            onCheckedChange = { watched = it },
                        )
                    }
                }
                /*            Row{
                                MyMapTheme {
                                    Surface(
                                        modifier = Modifier.fillMaxSize(),
                                        color = MaterialTheme.colors.background
                                    ) {
                                        MainMap(latitude, longitude)
                                    }
                                }
                            }*/
                if (itemUiState.submitResult is Result.Error) {
                    Text(
                        text = "Failed to submit item - ${(itemUiState.submitResult as Result.Error).exception?.message}",
                        modifier = Modifier.fillMaxWidth(),
                    )
                }
            }
        }
        DeleteMessage(shown = isDeleting)
    }
}

@Composable
private fun DeleteMessage(shown: Boolean) {
    AnimatedVisibility(
        visible = shown,
        enter = slideInVertically(
            initialOffsetY = { fullHeight -> -fullHeight },
            animationSpec = tween(durationMillis = 150, easing = LinearOutSlowInEasing)
        ),
        exit = slideOutVertically(
            targetOffsetY = { fullHeight -> -fullHeight },
            animationSpec = tween(durationMillis = 250, easing = FastOutLinearInEasing)
        )
    ) {
        androidx.compose.material.Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colors.secondary,
            elevation = 4.dp
        ) {
            androidx.compose.material.Text(
                text = "Delete is not available",
                modifier = Modifier.padding(16.dp)
            )
        }
    }
}
@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun MainMap(latitude: Double, longitude: Double)
{
    Permissions(
        permissions = listOf(
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.ACCESS_FINE_LOCATION
        ),
        rationaleText = "Please allow app to use location (coarse or fine)",
        dismissedText = "O noes! No location provider allowed!"
    ) {
        MyMap(lat = latitude, long = longitude)
    }
    //return MyMap(lat = latitude, long = longitude)
}
