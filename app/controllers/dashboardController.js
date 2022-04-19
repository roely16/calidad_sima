app.controller('dashboardController', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', '$location', function($scope, $http, $routeParams, $timeout, $rootScope, $location){

    /** Cargas selectores de fechas */

    

    $scope.isLoading = true

    $(document).ready(function(){
        $scope.dashboard = {}
        $scope.dashboard.FECHA_INICIO = moment().startOf('month').format('DD/MM/YYYY')
        $scope.dashboard.FECHA_FIN = moment().endOf('month').format('DD/MM/YYYY')
        $scope.dashboard.GRAFICA = "n"

        /** Fecha manual */
        // $scope.dashboard.FECHA_INICIO = "01/01/2019"
        // $scope.dashboard.FECHA_FIN = "31/12/2019"

    })

    $(function () {
        $('#datetimepicker1').datetimepicker({
            format: 'DD/MM/YYYY'
        });

        $('#datetimepicker2').datetimepicker({
            format: 'DD/MM/YYYY',
            useCurrent: false
        });
    });

    $scope.grafica_select = [
        { id: "n", name: "Todas las gráficas" },
        { id: 1, name: "Expedientes Recibidos del Sector Justicia" },
        { id: 2, name: "Control de Calidad" },
		{ id: 3, name: "Criterios de Calidad" }
    ]

    $scope.isLoadingModal = function(){

        Swal({
            title: 'Obteniendo datos',
            html: 'Por favor espere un momento...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        })

    }

    /** Cargar al inicio */
    $scope.cargarGraficas = function(){

        $scope.isLoadingModal()
        $scope.graficaPlazos()
        $scope.graficaCalidad()
		$scope.graficaCriterios(1)
		$scope.graficaTecnicos()

    }

    $scope.graficaPlazos = function(final){

        $http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "graficaPlazos",
                "param": {
                    "fecha_inicio": $scope.dashboard.FECHA_INICIO,
                    "fecha_fin": $scope.dashboard.FECHA_FIN
                }
            },
            headers: {
                "Content-Type": "application/json",
            }

        }).then(function successCallback(response){

			console.log(response)

            $('#grafica1').remove()
			$('#grafica1_container').append('<canvas id="grafica1"></canvas>')

            var fecha = $('#datetimepicker1').val() + " - " + $('#datetimepicker2').val()

            var ctx = document.getElementById("grafica1").getContext('2d');
            var myChart = new Chart(ctx, {
                plugins: [ChartDataLabels],
                type: 'bar',
                data: {
                    labels: [fecha],
                    datasets: [{
                        label: 'Ingresados',
                        data: [response.data.result[0]],
                        backgroundColor: [
                            'rgba(66, 152, 244, 0.7)',
                        ],
                        borderColor: [
                            'rgba(66, 152, 244, 1)',
                        ],
                        borderWidth: 2
                    },
                    {
                        label: "En Tiempo",
                        data: [response.data.result[1]],
                        backgroundColor: [
                            'rgba(60, 234, 87, 0.7)',
                        ],
                        borderColor: [
                            'rgba(60, 234, 87, 1)',
                        ],
                        borderWidth: 2
                    },
                    {
                        label: "En Proceso",
                        data: [response.data.result[2]],
                        backgroundColor: [
                            'rgba(255, 206, 86, 0.7)',
                        ],
                        borderColor: [
                            'rgba(255, 206, 86, 1)',
                        ],
                        borderWidth: 2
                    },
                    {
                        label: "Fuera de Tiempo",
                        data: [response.data.result[3]],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)'
                        ],
                        borderWidth: 2
                    }
                ]
                },
                options: {
                    plugins: {
                        datalabels: {
                            color: 'black',
                            font: {
                                weight: 'bold'
                            },
                            formatter: Math.round
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    },
                    legend: {
                        display: true,
                        position: "bottom"
                    },
                }
            });

            if (final) {
                $scope.isLoading = false
                Swal.close()
            }

        })
    }

    $scope.graficaCalidad = function(final){

        /** Obtener datos */
        $http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "graficaCalidad",
                "param": {
                    "fecha_inicio": $scope.dashboard.FECHA_INICIO,
                    "fecha_fin": $scope.dashboard.FECHA_FIN
                }
            },
            headers: {
                "Content-Type": "application/json"
            }

        }).then(function successCallback(response){

            $scope.total_documentos_calidad = response.data.result[0]

            var randomScalingFactor = function() {
                return Math.round(Math.random() * 100);
            };

            $('#grafica2').remove()
            $('#grafica2_container').append('<canvas id="grafica2"></canvas>')

            var ctx = document.getElementById('grafica2').getContext('2d');
            window.myDoughnut = new Chart(ctx, {
                plugins: [ChartDataLabels],
                type: 'pie',
                data: {
                    labels: ["Correctos", "Pendientes", "Rechazados"],
                    datasets: [
                        {
                            data: [
                                 response.data.result[1], response.data.result[2], response.data.result[3]
                            ],
                            backgroundColor: [
                                'rgba(60, 234, 87, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(255, 99, 132, 0.7)'
                            ],
                            borderColor: [
                                'rgba(60, 234, 87, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(255,99,132,1)'
                            ],
                            borderWidth: 2,
                        }
                    ],
                },
                options: {
                    plugins: {
                        datalabels: {
                            color: 'black',
                            font: {
                                weight: 'bold'
                            },
                            formatter: Math.round
                        }
                    },
                    responsive: true,
                    legend: {
                        position: 'bottom',
                    },

                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                    // events: ['click']
                    onClick: function(e) {
                        var element = this.getElementAtEvent(e);
                        if (element.length) {

                           if (element[0]._index == 2) {

                                $scope.detalleDocumentosRechazados()                            
                           }

                        }
                     },
                },
                tooltips: {
                    callbacks: {
                      label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].labels[tooltipItem.index];
                        var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return label + ': ' + value;
                      }
                    }
                  }
            });

            if (final) {
                $scope.isLoading = false
                Swal.close()
            }

        })

    }

	$scope.graficaCriterios = function(final){

		$http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "graficaCriterios",
                "param": {
                    "fecha_inicio": $scope.dashboard.FECHA_INICIO,
                    "fecha_fin": $scope.dashboard.FECHA_FIN
                }
            },
            headers: {
                "Content-Type": "application/json"
            }

        }).then(function successCallback(response){

			console.log(response.data)

			$('#grafica3').remove()
            $('#grafica3_container').append('<canvas id="grafica3"></canvas>')

			var ctx = document.getElementById("grafica3").getContext('2d');
			var myChart = new Chart(ctx, {
				plugins: [ChartDataLabels],
                type: 'bar',
                data: {
					labels: ["Criterio de Calidad"],
					datasets: response.data.result
				},
				options: {
                    plugins: {
                        datalabels: {
                            color: 'black',
                            font: {
                                weight: 'bold'
                            },
                            formatter: Math.round
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    },
                    legend: {
                        display: true,
                        position: "bottom",
						labels: {
							boxWidth: 40,
							fontSize: 12,
							fontStyle: 'bold',
							fontColor: '#000'
						}
                    },
                }
			});

			if (final) {
                $scope.isLoading = false
                Swal.close()
            }

		})

	}

	$scope.graficaTecnicos = function(final){



	}

	$scope.graficaIndicador = function(){



	}

    $scope.actualizarGraficas = function(){

        $scope.isLoadingModal()

        $scope.dashboard.FECHA_INICIO = $('#datetimepicker1').val()
        $scope.dashboard.FECHA_FIN = $('#datetimepicker2').val()

        if ($scope.dashboard.GRAFICA == 'n') {

            $scope.cargarGraficas()

        }else if($scope.dashboard.GRAFICA == 1){

            $scope.graficaPlazos(1)

        }else if($scope.dashboard.GRAFICA == 2){

            $scope.graficaCalidad(1)

        }else if($scope.dashboard.GRAFICA == 3){

            $scope.graficaCriterios(1)

        }

    }

    $scope.detalleDocumentosRechazados = function(){

        $http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "detalleDocumentosRechazados",
                "param": {
                    "fecha_inicio": $scope.dashboard.FECHA_INICIO,
                    "fecha_fin": $scope.dashboard.FECHA_FIN
                }
            },
            headers: {
                "Content-Type": "application/json"
            }

        }).then(function successCallback(response){

            $scope.documentos_rechazados = response.data.result

            console.log($scope.documentos_rechazados)

            $('#modalDetalleRechazos').modal('show') 

        })

        

    }

    $scope.mostrarErrores = function(documento){

        console.log(documento)
        documento.OCULTAR_DETALLE = !documento.OCULTAR_DETALLE

    }

}])
