app.controller('plazosController', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', '$location', function($scope, $http, $routeParams, $timeout, $rootScope, $location){

    $scope.data_limit = 10
    $scope.maxSize = 5
    $scope.total_registros = [5, 10, 25, 50, 100]
    $scope.current_grid = 1
    $scope.isLoading = true
    $scope.temp_documentos = {}

    Swal({
        title: 'Obteniendo datos',
        html: 'Por favor espere un momento...',
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    })

    /* Peticion de documentos */
    $http({

        method: 'POST',
        url: '/GestionServicios/calidad_sima_api/',
        data: {
            "name": "reporte_cumplimiento_plazos",
            "param": {

            }
        },
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function successCallback(response){

        console.log(response.data)

        $scope.isLoading = false
        Swal.close()

        $scope.documentos = response.data.result[0]
        $scope.temp_documentos = $scope.documentos
        $scope.filter_data = $scope.documentos.length

        $scope.fecha_reporte = response.data.result[1]
        $scope.en_tiempo = response.data.result[2]
        $scope.en_proceso = response.data.result[3]
        $scope.fuera_tiempo = response.data.result[4]
        $scope.fecha_inicio = response.data.result[5]
        $scope.fecha_fin = response.data.result[6]

    })

    /** Obteniendo Datos */
    $scope.obteniendo_datos = function(){

        Swal({
            title: 'Obteniendo datos',
            html: 'Por favor espere un momento...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        })

    }

    /** Modal para filtrar por fecha  */
    $scope.rangoFechas = function(){

        $scope.filtrar = {}
        $scope.filtrar.FECHA_INICIO = ""
        $scope.filtrar.FECHA_FIN = ""

        $('#datetimepicker1').val('')
        $('#datetimepicker2').val('')

        $scope.title_modal = "Seleccionar rango de fechas"

        $('#modalSmPlazos').modal('show')

        $('#modalSmPlazos').on('shown.bs.modal', function (e) {

            /** Fechas */
            $(function () {
                $('#datetimepicker1').datetimepicker({
                    format: 'DD/MM/YYYY'
                });

                $('#datetimepicker2').datetimepicker({
                    format: 'DD/MM/YYYY',
                    useCurrent: false
                });
            });

        })

    }

    /** Filtrar por fecha */
    $scope.filtrarFecha = function(){

        $scope.filtrar.FECHA_INICIO = $('#datetimepicker1').val()
        $scope.filtrar.FECHA_FIN = $('#datetimepicker2').val()

        $scope.obteniendo_datos();
        $('#modalSmPlazos').modal('hide')

        $http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "reporte_cumplimiento_plazos_filtrado",
                "param": {
                    "fecha_inicio": $scope.filtrar.FECHA_INICIO,
                    "fecha_fin": $scope.filtrar.FECHA_FIN
                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function successCallback(response){

            console.log(response.data)

            $scope.isLoading = false
            Swal.close()

            $scope.documentos = response.data.result[0]
            $scope.temp_documentos = $scope.documentos
            $scope.filter_data = $scope.documentos.length

            $scope.fecha_reporte = response.data.result[1]
            $scope.en_tiempo = response.data.result[2]
            $scope.en_proceso = response.data.result[3]
            $scope.fuera_tiempo = response.data.result[4]
            $scope.fecha_inicio = response.data.result[5]
            $scope.fecha_fin = response.data.result[6]

        })

    }

    /** Imprimir Reporte */
    $scope.imprimirReporte = function(){

		console.log('Imprimir Reporte')

		var doc = new jsPDF('l', 'pt');

		/* Encabezado del reporte */
		doc.setFontSize(18)
		doc.text(20, 40, "REPORTE DE EXPEDIENTES DEL SECTOR JUSTICIA")
		doc.text(20, 65, $scope.fecha_reporte)

		var logo = "data:image/png;base64,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"

		doc.addImage(logo, 'JPEG', 710, 20)

		var options = {
			theme: 'striped',
			margin: {
				top: 30,
				left: 10,
				right: 10
			},
			styles: { fontSize: 7, columnWidth: 'auto',},
			startY: 90,
			addPageContent: function(data) {

				var fecha = new Date()
				var mes = fecha.getMonth() + 1
				doc.setFontSize(8)
				doc.text(10, 570, "Generado el " + fecha.getDate() + "/" + mes + "/" + fecha.getFullYear() + " a las " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds())

				doc.text(350, 570, "Cantidad de registros: " + $scope.documentos.length )

			},
			// columnStyles:{
			// 		0: {halign:'right'},
			// 		1: {halign:'right'},
			// 		2: {halign:'left'},
			// 		3: {halign:'left'},
			// 		4: {halign:'right'},
			// 		5: {halign:'left'},
			// 		6: {halign:'left'},
			// 		7: {halign:'left'},
			// 		8: {halign:'left'},
			// 		9: {halign:'left'}
			// },
			headerStyles: {
				halign:'left',

			},
		};

		var res = doc.autoTableHtmlToJson(document.getElementById("tabla_reporte"));
		doc.autoTable(res.columns, res.data, options);

		doc.save('Reporte SIMA '+ $scope.fecha_reporte + '.pdf')

    }

    /** Todos los documentos */
    $scope.todosDocumentos = function(){

        $scope.documentos = $scope.temp_documentos
        $scope.filter_data = $scope.documentos.length
    }

    /** Documentos en tiempo */
    $scope.documentosEnTiempo = function(){

        $scope.obteniendo_datos();

        $http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "documentosEnTiempo",
                "param": {
                    "fecha_inicio": $scope.fecha_inicio,
                    "fecha_fin": $scope.fecha_fin
                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function successCallback(response){

            console.log(response.data)

            $scope.isLoading = false
            Swal.close()

            $scope.documentos = response.data.result
            $scope.filter_data = $scope.documentos.length

        })

    }

    /** Documentos en proceso */
    $scope.documentosEnProceso = function(){

        $scope.obteniendo_datos();

        $http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "documentosEnProceso",
                "param": {
                    "fecha_inicio": $scope.fecha_inicio,
                    "fecha_fin": $scope.fecha_fin
                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function successCallback(response){

            console.log(response.data)

            $scope.isLoading = false
            Swal.close()

            $scope.documentos = response.data.result
            $scope.filter_data = $scope.documentos.length

        })

    }

    /** Documentos fuera de tiempo */
    $scope.documentosFueraTiempo = function(){

        $scope.obteniendo_datos();

        $http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "documentosFueraTiempo",
                "param": {
                    "fecha_inicio": $scope.fecha_inicio,
                    "fecha_fin": $scope.fecha_fin
                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function successCallback(response){

            console.log(response.data)

            $scope.isLoading = false
            Swal.close()

            $scope.documentos = response.data.result
            $scope.filter_data = $scope.documentos.length

        })

    }


    /* Paginación y busqueda */
	$scope.page_position = function(page_number){

		$scope.current_grid = page_number
	}

	$scope.filter = function(){

		$timeout(function(){
			$scope.filter_data = $scope.searched.length
		}, 20)
	}

	$scope.sort_with = function(base){

		$scope.base = base
		$scope.reverse = !$scope.reverse
	}

}])
