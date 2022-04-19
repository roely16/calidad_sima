app.controller('revisionController', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', '$location', function($scope, $http, $routeParams, $timeout, $rootScope, $location){

    $('#modalLgRevisionDocumentos').on('hidden.bs.modal', function (e) {

        $('#collapseExample').collapse('hide')
        $scope.calidad1_contador = 0

        /** Volver a colocar la lista de verificación */
        $('#criterios').empty()
		//$('#graph-container_rendimiento').append('<canvas id="graficaRendimiento"></canvas>')

    })

    $scope.data_limit = 10
    $scope.data_limit_control2 = 10
    $scope.data_limit_control3 = 10
    $scope.maxSize = 5
    $scope.total_registros = [5, 10, 25, 50, 100]
    $scope.current_grid = 1
    $scope.current_grid_control2 = 1
    $scope.current_grid_control3 = 1
    $scope.isLoading = true
    $scope.fase = 2

    var criterios_seleccionados = []

    /** Control de Calidad 2 */
    $scope.calidad1 = {}
    $scope.calidad1_contador = 0
    $scope.criterios1 = [
        { id: 1, name: "Que la solicitud esté dirigida a la DCAI", radio_name: "criterio1" },
        { id: 2, name: "Que la solicitud esté sellada y firmada por el solicitante", radio_name: "criterio2" },
        { id: 3, name: "Ingreso correcto del nombre del solicitante", radio_name: "criterio3" },
        { id: 4, name: "Ingreso del código de trámite correcto", radio_name: "criterio4" },
        { id: 5, name: "Ingreso del plazo correcto", radio_name: "criterio5" },
        { id: 6, name: "Correcta búsqueda en bases de datos", radio_name: "criterio6" },
        { id: 7, name: "Correcta certificación del producto", radio_name: "criterio7" },
        { id: 8, name: "Número de expediente interno", radio_name: "criterio8" },
        { id: 9, name: "Datos del destinatario / Dirección de notificación", radio_name: "criterio9" },
        { id: 10, name: "Número de expediente externo", radio_name: "criterio10" }
    ]

    /** Control de Calidad 3 */
    $scope.calidad2 = {}
    $scope.calidad2_contador = 0
    $scope.criterios2 = [
        { id: 11, name: "Revisión de fecha y hora de traslado de certificación", radio_name: "criterio11" },
        { id: 12, name: "Revisión de fecha y hora de traslado a mensajeria", radio_name: "criterio12" },
        { id: 13, name: "Revisión de fecha y hora de notificación", radio_name: "criterio13" },
        { id: 14, name: "Revisión del correcto ingreso de la fecha y hora de notificación en el módulo", radio_name: "criterio14" },
        { id: 15, name: "Verificación del incumplimiento en el plazo", radio_name: "criterio15" },
        { id: 16, name: "Veritificación del correcto escaneo del documento", radio_name: "criterio16" },
    ]

    $scope.filtrar = {}
    $scope.filtrar.FECHA_INICIO = ""
    $scope.filtrar.FECHA_FIN = ""

    /** Ejecutar al cargar el módulo */
    $scope.moduloRevision = function(){

        $scope.isLoadingModal()
        $scope.datosControl1()
        $scope.datosControl2()
        $scope.finalizados(1)
    }

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

    $scope.successProcess = function(){

        Swal(
            'Good job!',
            'You clicked the button!',
            'success'
        )

    }

    $scope.datosControl1 = function(final, modal, success){

        $http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "obtener_lotes",
                "param": {

                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function successCallback(response){

            console.log(response.data.result);

            if (final) {
                Swal.close()
            }

            $scope.isLoading = false
            $scope.documentos = response.data.result
            $scope.filter_data = $scope.documentos.length

            if (modal) {
                $(modal).modal('hide')
            }

        })

    }

    $scope.datosControl2 = function(final, modal, success){

        $http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "documentosControl2",
                "param": {

                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function successCallback(response){

            console.log(response.data)

            if (final) {
                Swal.close()
            }

            $scope.documentos_control2 = response.data.result
            $scope.filter_data_control2 = $scope.documentos_control2.length

            if (modal) {
                $(modal).modal('hide')
            }

        })

    }

    $scope.obtenerCriterios = function(fase){
    }

    $scope.finalizados = function(final, modal, success){

        console.log($scope.filtrar)

        $scope.filtrar.FECHA_INICIO = $('#datetimepicker1').val()
        $scope.filtrar.FECHA_FIN = $('#datetimepicker2').val()

        $http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "documentosControlFinalizados",
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

            if (final) {
                Swal.close()
            }

            $scope.documentos_finalizados = response.data.result
            $scope.filter_data_finalizados = $scope.documentos_finalizados.length

            if (modal) {
                $(modal).modal('hide')
            }

            $('#modalSmPlazos').modal('hide')

        })

    }

	$scope.marcarTodos = function(){

		$scope.criterios.forEach(function (element){
			$( "#" + element.ID ).trigger( "click" );
		})

	}

    /** Mostrar modal para ver detalles del documento */
    $scope.modalDetallesDocumento = function(id_documento, fase){

        $scope.checkStatus = false
        $scope.calidad1_contador = 0
		$scope.marcar_todos = false

        $http({

            method: 'POST',
            url: '/GestionServicios/calidad_sima_api/',
            data: {
                "name": "detallesDocumento",
                "param": {
                    "id_documento": id_documento,
                    "fase": $scope.fase
                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function successCallback(response){

            $scope.detalle_documento = response.data.result

            console.log(response.data)

            if (fase == 1) {

                $scope.criterios = $scope.detalle_documento.CRITERIOS_CALIDAD

            }else if(fase == 2){

                $scope.criterios = $scope.detalle_documento.CRITERIOS_CALIDAD

            }

            $scope.title_modal = "Detalles de Documento "
            $scope.modal_template = "views/modals/revision_documentos/detalles_documento.html"

            $('#modalLgRevisionDocumentos').modal('show')

            $('#modalLgRevisionDocumentos').on('shown.bs.modal', function (e) {

                $('#collapseExample').collapse('hide')

                // $('.criterio').prop('checked', false)
                // $scope.checkStatus = false;
                // $scope.calidad1_contador = 0
                criterios_seleccionados = []

                $('input[type=checkbox]').each(function () {
                    //sList += "(" + $(this).val() + "-" + (this.checked ? "checked" : "not checked") + ")";
                    $(this).prop('checked', false)
                });

            })

        })

    }

    $scope.calificaCriterio = function(checkStatus, id_criterio){

		console.log(checkStatus)

        if (checkStatus) {
            $scope.calidad1_contador++
            criterios_seleccionados.push(id_criterio)
        }else{
            $scope.calidad1_contador--
            criterios_seleccionados.splice( criterios_seleccionados.indexOf(id_criterio), 1 );
        }

        console.log($scope.calidad1_contador)
		console.log(criterios_seleccionados)

    }

    $scope.acierto = function(document, year, calidad){

        Swal.fire({
            title: '¿Está seguro?',
            text: "Una vez procesada la solicitud no se podra revertir!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, aceptar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {

            if (result.value) {

                $scope.isLoadingModal()

                $http({

                    method: 'POST',
                    url: '/GestionServicios/calidad_sima_api/',
                    data: {
                        "name": "documentoAcierto",
                        "param": {
                            "document": document,
                            "year": year,
                            "calidad": calidad
                        }
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function successCallback(response){

                    if ($scope.fase == 2) {

                        $scope.datosControl1()
                        $scope.datosControl2(1, '#modalLgRevisionDocumentos')

                    }else if($scope.fase == 3){

                        $scope.datosControl2()
                        $scope.finalizados(1, '#modalLgRevisionDocumentos')

                    }else if($scope.fase == 3){

                    }

                    $scope.calidad1_contador = 0

                })

            }
        })

    }

    $scope.error = function(document, year){

        /** Capturar que criterios no fueron cumplidos */

        Swal.fire({
            title: '¿Está seguro?',
            text: "Una vez procesada la solicitud no se podra revertir!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, rechazar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {

            if (result.value) {

                $scope.isLoadingModal()

                var criterios_temp = $scope.criterios

                $scope.array_criterios_seleccionados = []

                criterios_temp.forEach(element1 => {

                    criterios_seleccionados.forEach(element2 => {

                        if (element1.ID == element2) {

                            $scope.array_criterios_seleccionados.push(element1)
                        }

                    })

                });

                /** Convertir en String separado por comas */

                $scope.errores = $scope.criterios.filter(function(n){
                    return  $scope.array_criterios_seleccionados.indexOf(n)>-1?false:n;
                });

                $scope.nombres_errores = []
				$scope.id_errores = []

                $scope.errores.forEach(element => {

                    $scope.nombres_errores.push(element.CRITERIO)
					$scope.id_errores.push(element.ID)

                });

                $scope.str_comas = $scope.nombres_errores.join()

                $http({

                    method: 'POST',
                    url: '/GestionServicios/calidad_sima_api/',
                    data: {
                        "name": "documentoError",
                        "param": {
                            "document": document,
                            "year": year,
                            "errores": $scope.str_comas,
							"id_errores": $scope.id_errores
                        }
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }

                }).then(function successCallback(response){

                    if ($scope.fase == 2) {

                        $scope.datosControl1(1, '#modalLgRevisionDocumentos')

                    }else if($scope.fase == 3){

                        $scope.datosControl2(1, '#modalLgRevisionDocumentos')

                    }

                    $scope.calidad1_contador = 0

					console.log(response.data)

                })

            }

        })

    }

    /* Paginación y busqueda */
	$scope.page_position = function(page_number){

        $scope.current_grid = page_number
        
        console.log('page changed')
    }
    
    $scope.pageChanged = function(page_number){

        console.log(page_number)

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

}])
