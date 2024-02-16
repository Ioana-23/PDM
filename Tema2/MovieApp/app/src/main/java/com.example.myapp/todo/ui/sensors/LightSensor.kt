package com.example.myapp.todo.ui.sensors

import android.app.Application
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.myapp.MyApp
import com.example.myapp.MyAppNavHost
import com.example.myapp.ui.theme.MyAppTheme
import com.example.myapp.ui.theme.MyDarkTheme
import kotlinx.coroutines.launch

class LightSensorViewModel(application: Application) : AndroidViewModel(application) {
    var uiState by mutableStateOf(false)
        private set

    init {
        viewModelScope.launch {
            LightSensorMonitor(getApplication()).isBright.collect {
                uiState = it
            }
        }
    }

    companion object {
        fun Factory(application: Application): ViewModelProvider.Factory = viewModelFactory {
            initializer {
                LightSensorViewModel(application)
            }
        }
    }
}

@Composable
fun LightSensor(content: @Composable () -> Unit) {
    val lightSensorViewModel = viewModel<LightSensorViewModel>(
        factory = LightSensorViewModel.Factory(
            LocalContext.current.applicationContext as Application
        )
    )
    if(!lightSensorViewModel.uiState)
    {
        MyDarkTheme {
            Surface {
                content()
            }
        }
    }
    else
    {
        MyAppTheme {
            Surface {
                content()
            }
        }
    }
}