package com.example.myapp.todo.ui.items

import android.app.Application
import android.util.Log
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.material.BottomAppBar
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapp.R
import com.example.myapp.ui.theme.MyJobsViewModel
import com.example.myapp.ui.theme.MyNetworkStatus

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemsScreen(onItemClick: (id: String?) -> Unit, onAddItem: () -> Unit, onLogout: () -> Unit) {
    Log.d("ItemsScreen", "recompose")
    val itemsViewModel = viewModel<ItemsViewModel>(factory = ItemsViewModel.Factory)
    val itemsUiState by itemsViewModel.uiState.collectAsStateWithLifecycle(
        initialValue = listOf()
    )
    val myJobsViewModel = viewModel<MyJobsViewModel>(
        factory = MyJobsViewModel.Factory(
            LocalContext.current.applicationContext as Application
        ))
    /*MyNetworkStatus()
    val myNewtworkStatusViewModel = viewModel<MyNetworkStatusViewModel>(
        factory = MyNetworkStatusViewModel.Factory(
            LocalContext.current.applicationContext as Application
        )
    )*/
    Scaffold(
        topBar = {
            /*Text(
            "Is online: ${myNewtworkStatusViewModel.uiState}",
        )*/
        MyNetworkStatus()}
    ) { padding->
        Scaffold(
            Modifier.padding(PaddingValues(horizontal = 16.dp, vertical = 32.dp)),
            topBar = {
                TopAppBar(
                    title = { Text(text = stringResource(id = R.string.items)) },
                    actions = {
                        Button(onClick = onLogout) { Text("Logout") }
                    }
                )
            },
            bottomBar = {
                BottomAppBar (
                    content = {Text(text = "${myJobsViewModel.uiState}")}
                )
            },
            floatingActionButton = {
                FloatingActionButton(
                    onClick = {
                        Log.d("ItemsScreen", "add")
                        onAddItem()
                    },
                ) { Icon(Icons.Rounded.Add, "Add") }
            }
        ) {
            ItemList(
                itemList = itemsUiState,
                onItemClick = onItemClick,
                modifier = Modifier.padding(it)
            )
        }
    }
}

@Preview
@Composable
fun PreviewItemsScreen() {
    ItemsScreen(onItemClick = {}, onAddItem = {}, onLogout = {})
}
