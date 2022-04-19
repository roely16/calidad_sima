app.controller('trasladoController', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', '$location', function($scope, $http, $routeParams, $timeout, $rootScope, $location){

    $scope.total_registros = [5, 10, 25, 50, 100]

    /** Tab1 */
    $scope.data_limit_tab1 = 10
    $scope.maxSize_tab1 = 5
    $scope.current_grid_tab1 = 1
    $scope.isLoading_tab1 = true

    /** Tab2 */
    $scope.data_limit_tab2 = 10
    $scope.maxSize_tab2 = 5
    $scope.current_grid = 1
    $scope.isLoading_tab2 = true

    /** Fechas de inicio y fin de mes */
    $scope.filtro = {}
    $scope.filtro.FECHA_INICIO = moment().startOf('month').format('DD/MM/YYYY')
    $scope.filtro.FECHA_FIN = moment().endOf('month').format('DD/MM/YYYY')
	
    $scope.trasladar = {}
    $scope.trasladar.LISTA = ""

    /** Marcar Todos */
    $scope.marcarTodos = function(){

        if ($scope.todos) {

            arrayList = []
            /** Marcar todos */
            $scope.documentos.forEach(element => {

                arrayList.push(element.DOCUMENTO)
                $scope.trasladar.LISTA = arrayList

            });

        }else{

            /** Borrar todos */
            $scope.trasladar.LISTA = ""
        }

    }

    /** Cargando */
    $scope.cargando = function(){

        Swal({
            title: 'Obteniendo datos',
            html: 'Por favor espere un momento...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        })

    }

    /** Ejecutar al momento que carga el módulo */
    $scope.cargarTrasladoDocumentos = function(){

        $scope.cargando()
        $scope.documentosParaTraslado()
        $scope.documentosTrasladados()

    }

    $scope.trasladarDocumento = function(){

        /** Preguntar si esta seguro de trasladar los documentos seleccionados */
        Swal({
            title: 'Trasladar Documentos',
            text: "¿Está seguro que desea trasladar " + $scope.trasladar.LISTA.length + " documentos?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Trasladar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {

                $http({

                    method: 'POST',
                    url: 'http://localhost/GestionServicios/calidad_sima_api/',
                    data: {
                        "name": "trasladarDocumentos",
                        "param": {
                            "documentos": $scope.trasladar.LISTA
                        }
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function successCallback(response){

                    console.log(response.data)

                })

            }
        })
    }

    /** Obtener documentos que no han sido trasladados */
    $scope.documentosParaTraslado = function(){

        $http({

            method: 'POST',
            url: 'http://localhost/GestionServicios/calidad_sima_api/',
            data: {
                "name": "documentoParaTraslado",
                "param": {
                    "fecha_inicio": $scope.filtro.FECHA_INICIO,
                    "fecha_fin": $scope.filtro.FECHA_FIN

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

    /** Obtener documentos que ya fueron trasladados */
    $scope.documentosTrasladados = function(){

        $http({

            method: 'POST',
            url: 'http://localhost/GestionServicios/calidad_sima_api/',
            data: {
                "name": "documentosTrasladados",
                "param": {
                    "fecha_inicio": $scope.filtro.FECHA_INICIO,
                    "fecha_fin": $scope.filtro.FECHA_FIN
                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function successCallback(response){

            console.log(response.data)
            Swal.close()

            $scope.isLoading = false
            $scope.documentos_trasladados = response.data.result
            $scope.filter_data_documentos_trasladados = $scope.documentos_trasladados.length

        })

    }

    /** Modal Filtrar por fecha */
    $scope.modalFiltroFechaTab1  = function(){

        $scope.filtrar = {}
        $scope.filtrar.FECHA_INICIO = ""
        $scope.filtrar.FECHA_FIN = ""

        $('#datetimepicker1').val('')
        $('#datetimepicker2').val('')

        $('#modalFiltroFechaT1').modal('show')

        $('#modalFiltroFechaT1').on('shown.bs.modal', function (e) {

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
    $scope.filtrarFechaTab1 = function(){

        $scope.filtro.FECHA_INICIO = $('#datetimepicker1').val()
        $scope.filtro.FECHA_FIN = $('#datetimepicker2').val()

        $scope.cargando()
        $scope.documentosParaTraslado()

        $('#modalFiltroFechaT1').modal('hide')

    }

    $scope.modalDetallesDocumento = function(id){

        $http({

            method: 'POST',
            url: 'http://localhost/GestionServicios/calidad_sima_api/',
            data: {
                "name": "detallesDocumento",
                "param": {
                    "documento": id
                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function successCallback(response){

            $scope.detalle_documento = response.data.result
            console.log(response.data)

        })

        $scope.modal_template = "views/modals/traslado_documentos/detalles_documento.html"
        $scope.title_modal = "Detalles de Documento"
        $('#modalLg').modal('show')

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
