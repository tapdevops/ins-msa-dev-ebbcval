/*
 |--------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------
 */
	// Node Modules
	const RoutesVersioning = require( 'express-routes-versioning' )();

	// Controllers
	const Controllers = {
		v_1_1: {
			EBCCValidationDetail: require( _directory_base + '/app/v1.1/Http/Controllers/EBCCValidationDetailController.js' ),
			EBCCValidationHeader: require( _directory_base + '/app/v1.1/Http/Controllers/EBCCValidationHeaderController.js' ),
			Export: require( _directory_base + '/app/v1.1/Http/Controllers/ExportController.js' ),
			Kualitas: require( _directory_base + '/app/v1.1/Http/Controllers/KualitasController.js' ),
			Report: require( _directory_base + '/app/v1.1/Http/Controllers/ReportController.js' ),
			SyncMobile: require( _directory_base + '/app/v1.1/Http/Controllers/SyncMobileController.js' ),
			Summary: require( _directory_base + '/app/v1.1/Http/Controllers/SummaryController.js' ),
		},
		v_1_0: {
			EBCCValidationDetail: require( _directory_base + '/app/v1.0/Http/Controllers/EBCCValidationDetailController.js' ),
			EBCCValidationHeader: require( _directory_base + '/app/v1.0/Http/Controllers/EBCCValidationHeaderController.js' ),
			Export: require( _directory_base + '/app/v1.0/Http/Controllers/ExportController.js' ),
			Kualitas: require( _directory_base + '/app/v1.0/Http/Controllers/KualitasController.js' ),
			Report: require( _directory_base + '/app/v1.0/Http/Controllers/ReportController.js' ),
			SyncMobile: require( _directory_base + '/app/v1.0/Http/Controllers/SyncMobileController.js' )
		}
	}

	// Middleware
	const Middleware = {
		v_1_1: {
			KafkaServer: require( _directory_base + '/app/v1.1/Http/Middleware/KafkaServer.js' ),
			VerifyToken: require( _directory_base + '/app/v1.1/Http/Middleware/VerifyToken.js' )
		},
		v_1_0: {
			VerifyToken: require( _directory_base + '/app/v1.0/Http/Middleware/VerifyToken.js' )
		}
	}
	
/*
 |--------------------------------------------------------------------------
 | Routing
 |--------------------------------------------------------------------------
 */
	module.exports = ( app ) => {

		/*
		 |--------------------------------------------------------------------------
		 | Welcome Message
		 |--------------------------------------------------------------------------
		 */
			app.get( '/', ( req, res ) => {
				res.json( { 
					application: {
						name : config.app.name,
						env : config.app.env,
						port : config.app.port[config.app.env],
						version_available: [
							"1.1",
							"1.0"
						]
					} 
				} )
			} );

		/*
		 |--------------------------------------------------------------------------
		 | API Versi 1.1
		 |--------------------------------------------------------------------------
		 */
			// EBCC Validation Detail
			app.post( '/api/v1.1/ebcc/validation/detail', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.EBCCValidationDetail.create );

			// EBCC Validation Header
			app.post( '/api/v1.1/ebcc/validation/header', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.EBCCValidationHeader.create );

			// Export
			app.get( '/api/v1.1/export/tr-ebcc/:start_date/:end_date/:type', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Export.tr_ebcc );
			app.get( '/api/v1.1/export/tr-ebcc-kualitas/:start_date/:end_date/:type', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Export.tr_ebcc_kualitas );

			// Kualitas
			app.get( '/api/v1.1/ebcc/kualitas', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Kualitas.find );

			app.get( '/api/v1.1/summary', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Summary.ebcc );

			// Report
			app.get( '/api/v1.1/report/web/per-baris/:werks/:start_date/:end_date/:type', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Report.web_report_per_baris );

			// Sync Mobile
			app.get( '/api/v1.1/sync-mobile/kualitas/:start_date/:end_date', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.synchronize );

			// Sync TAP
			app.post( '/api/v1.1/sync-tap/kualitas', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Kualitas.create_or_update );

			// Summary
			app.get( '/api/v1.1/summary', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Summary.process_weekly )



		/*
		 |--------------------------------------------------------------------------
		 | API Versi 1.0
		 |--------------------------------------------------------------------------
		 */
			// EBCC Validation Detail
			app.post( '/api/v1.0/ebcc/validation/detail', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.EBCCValidationDetail.create );

			// EBCC Validation Header
			app.post( '/api/v1.0/ebcc/validation/header', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.EBCCValidationHeader.create );

			// Export
			app.get( '/api/v1.0/export/tr-ebcc/:start_date/:end_date', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Export.tr_ebcc );
			app.get( '/api/v1.0/export/tr-ebcc-kualitas/:start_date/:end_date', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Export.tr_ebcc_kualitas );

			// Kualitas
			app.get( '/api/v1.0/ebcc/kualitas', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Kualitas.find );

			// Report
			app.get( '/api/v1.0/report/web/per-baris/:werks/:start_date/:end_date', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Report.web_report_per_baris );

			// Sync Mobile
			app.get( '/api/v1.0/sync-mobile/kualitas/:start_date/:end_date', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.synchronize );

			// Sync TAP
			app.post( '/api/v1.0/sync-tap/kualitas', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Kualitas.create_or_update );

		/*
		 |--------------------------------------------------------------------------
		 | Old API
		 |--------------------------------------------------------------------------
		 */
		 	// EBCC Validation Detail
		 	app.post( '/ebcc/validation/detail', Middleware.v_1_0.VerifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.EBCCValidationDetail.create
			} ) );

		 	// EBCC Validation Header
		 	app.post( '/ebcc/validation/header', Middleware.v_1_0.VerifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.EBCCValidationHeader.create
			} ) );

			// Kualitas
			app.get( '/ebcc/kualitas', Middleware.v_1_0.VerifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Kualitas.find
			} ) );

			// Report
			app.get( '/report/web/per-baris/:werks_afd_block_code/:start_date/:end_date', Middleware.v_1_0.VerifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Report.web_report_per_baris
			} ) );

			// Sync Mobile
			app.get( '/sync-mobile/kualitas/:start_date/:end_date', Middleware.v_1_0.VerifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.SyncMobile.synchronize
			} ) );

			// Sync TAP
			app.post( '/sync-tap/kualitas', Middleware.v_1_0.VerifyToken, RoutesVersioning( {
				"1.0.0": Controllers.v_1_0.Kualitas.create_or_update
			} ) );

	}